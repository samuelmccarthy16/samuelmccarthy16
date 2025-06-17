import type {FC} from "react";
import type {TMenuItem} from "./types.ts";

import styles from './MenuItem.module.scss';

type TProps = {
  item: TMenuItem;
  onEditClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
}

export const MenuItem: FC<TProps> = ({ item, onEditClick, onDeleteClick }) => {
  return (
    <div className={styles.itemCard}>
      <div className={styles.description}>
        <div>{item.name} | {item.category}</div>
        <div style={{ marginTop: '8px', marginBottom: '8px' }}>{item.description}</div>
        {!item.isAvailable && (
          <div>not available</div>
        )}
        <div>Price: {item.price}</div>
      </div>
      <div className={styles.actions}>
        <button onClick={() => onEditClick(item.id)}>Edit</button>
        <button onClick={() => onDeleteClick(item.id)}>Delete</button>
      </div>
    </div>
  );
}
