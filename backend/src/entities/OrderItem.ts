import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ default: "pending" })
  status!: string; // "pending", "preparing", "ready", "served"

  @ManyToOne(() => Order, order => order.items)
  order!: Order;
}
