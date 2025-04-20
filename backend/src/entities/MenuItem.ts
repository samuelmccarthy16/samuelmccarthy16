import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column()
  category!: string; // "food" or "drink"

  @Column({ default: true })
  isAvailable!: boolean;
}
