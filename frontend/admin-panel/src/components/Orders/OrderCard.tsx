import type {TOrder} from "../../types.ts";
import type {FC} from "react";

import styles from "./OrderCard.module.scss";

type TProps = {
  order: TOrder;
}

export const OrderCard: FC<TProps> = ({ order }) => {
  const handleStatusChange = (value: string) => {
    localStorage.setItem(`[${order.id}]status`, value);
    console.log('>>> change', value);
  }
  const getStatus = () => {
    return localStorage.getItem(`[${order.id}]status`)?.toString();
  }
  return (
    <div className={styles.card}>
      <div>
        <div>Order at: {(new Date(order.createdAt)).toLocaleString()}</div>
        <div>Table number: {order.tableNumber}</div>
        <div className={styles.itemsWrapper}>
        {order.items.map(item => (
            <div key={item.id}>
              {/*<div>{item.name} x {item.quantity}: {item.status}</div>*/}
              <div>{item.name} x {item.quantity}</div>
            </div>
          ))}
        </div>
      </div>
      {/*<div>Order status: {order.status}</div>*/}
      <div className={styles.status}>
        <span>Order status:</span>
        <select name="status" onChange={(e) => handleStatusChange(e.target.value)} value={getStatus()}>
          <option value={1}>pending</option>
          <option value={2}>preparing</option>
          <option value={3}>ready</option>
          <option value={4}>served</option>
        </select>
      </div>
    </div>
  )
}

//"pending", "preparing", "ready", "served"
