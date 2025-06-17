import styles from "./Menu.module.scss";
import {type FC, useEffect, useRef} from "react";
import type {TMenuItem} from "./types.ts";

type TProps = {
  item?: TMenuItem;
  onCancel: () => void;
  onSave: (item: Omit<TMenuItem, 'id' | 'isAvailable'>) => void;
}

export const EditDialog: FC<TProps> = ({ item, onCancel, onSave }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item && nameRef.current && categoryRef.current && descriptionRef.current && priceRef.current) {
      nameRef.current.value = item.name;
      categoryRef.current.value = item.category;
      descriptionRef.current.value = item.description;
      priceRef.current.value = item.price.toString();
    }
  }, [item]);

  const handleSave = () => {
    if (nameRef.current && categoryRef.current && descriptionRef.current && priceRef.current) {
      onSave({
        name: nameRef.current.value,
        category: categoryRef.current.value,
        description: descriptionRef.current.value,
        price: Number(priceRef.current.value),
      });
    }
  }

  return (
    <dialog className={styles.editDialog}>
      <div className={styles.body}>
        <div className={styles.header}>Menu item edit</div>
        <label htmlFor="name">Name:<input ref={nameRef} type="text" id="name" name="name" /></label>
        <label htmlFor="category">Category:<input ref={categoryRef} type="text" id="category" name="category" /></label>
        <label htmlFor="description">Description:<textarea ref={descriptionRef} id="description" name="description" /></label>
        <label htmlFor="price">Price:<input ref={priceRef} type="text" id="price" name="price" /></label>
      </div>
      <div>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </dialog>
  );
}
