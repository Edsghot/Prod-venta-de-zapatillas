import { User } from "src/modules/user/entity/UserEntity.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm";
import { CartItem } from "./CartItem.entity";
import { Sale } from "src/modules/sale/entity/SaleEntity.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  IdCart: number;

  @ManyToOne(() => User, user => user.Carts)
  User: User;

  @OneToMany(() => CartItem, cartItem => cartItem.Cart)
  Items: CartItem[];

  @Column()
  DateAdded: Date;

  @Column()
  Deleted: Boolean;

  @OneToMany(() => Sale, (sale) => sale.Cart)
  Sales: Sale[];

}