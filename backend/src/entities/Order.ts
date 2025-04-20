import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderItem } from "./OrderItem";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tableNumber!: number;

  @Column({ default: "pending" })
  status!: string; // "pending", "preparing", "ready", "served"

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items!: OrderItem[];
}
