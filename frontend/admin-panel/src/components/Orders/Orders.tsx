import type {TOrder} from "../../types.ts";
import type {FC} from "react";
import {OrderCard} from "./OrderCard.tsx";

import styles from './Orders.module.scss';

type TProps = {
  data?: TOrder[];
}
export const Orders: FC<TProps> = ({ data }) => {
  if (!data) {
    return <p>No data</p>;
  }

  return (
    <div className={styles.grid}>
      {data
        ? data.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))
        : null}
    </div>
  )
}
