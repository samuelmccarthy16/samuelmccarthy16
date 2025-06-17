import {useEffect, useRef, useState} from "react";
import {MenuItem} from "./MenuItem.tsx";
import type {TMenuItem} from "./types.ts";

import styles from "./Menu.module.scss";
import {usePrevious} from "../../utils/hooks.ts";
import {EditDialog} from "./EditDialog.tsx";

export const Menu = () => {
  const [menuItems, setMenuItems] = useState<TMenuItem[]>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const prevTrigger = usePrevious(refetchTrigger);
  useEffect(() => {
    const fetchData = async (url: string) => {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        //setFetchErrorCode(response.status);
        return;
      }
      response.json().then(data => {
        setMenuItems(data);
        //setFetchErrorCode(undefined);;
      }).catch(e => {
        console.error('>>> err', e);
      });
    };

    if (prevTrigger !== refetchTrigger) {
      void fetchData(`${import.meta.env.VITE_API_URL}/menu`);
    }
  }, [prevTrigger, refetchTrigger]);

  useEffect(() => {
    console.log('menu items:', menuItems);
  }, [menuItems]);

  const editDialogRef = useRef<HTMLDialogElement>(null);
  const [editingItem, setEditingItem] = useState<number>();
  const [isEditDIalogOpen, setIsEditDialogOpen] = useState(false);
  const handleEditClick = (id: number) => {
    setIsEditDialogOpen(true);
    setEditingItem(id);
  }

  const handleCloseEdit = () => {
    editDialogRef.current?.close();
    setEditingItem(undefined);
  }
  const handleEditSave = async (item: Omit<TMenuItem, 'id' | 'isAvailable'>) => {
    console.log('editSave', item);
    const putUrl = `${import.meta.env.VITE_API_URL}/menu/${editingItem}`;
    const postUrl = `${import.meta.env.VITE_API_URL}/menu`;
    await fetch(editingItem === -1 ? postUrl : putUrl, {
      method: editingItem === -1 ? "POST" : "PUT",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // Or other content type
      },
      body: JSON.stringify({
        ...item,
      }),
    });
    handleCloseEdit();
    setRefetchTrigger(prev => prev + 1);
  }

  return (
    <>
      <div className={styles.menuWrapper}>
        {menuItems?.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            onEditClick={(id) => {
              console.log('editing', id);
              handleEditClick(id);
            }}
            onDeleteClick={async (id) => {
              console.log('deleting', id);
              const currentItem = menuItems.find(item => item.id === id);
              if (currentItem) {
                const result = window.confirm(`Are you sure you want to delete "${currentItem.name}"?`);
                if (result) {
                  await fetch(`${import.meta.env.VITE_API_URL}/menu/${id}`, {
                    method: "DELETE",
                    credentials: 'include',
                  });
                  setRefetchTrigger(prev => prev + 1);
                }
              }
            }}
          />
        ))}
      </div>
      <button className={styles.createButton} onClick={() => handleEditClick(-1)}>Create item</button>
      {isEditDIalogOpen && menuItems && editingItem && (
        <EditDialog item={menuItems.find(item => item.id === editingItem)} onCancel={handleCloseEdit} onSave={handleEditSave} />
      )}
    </>
  );
}
