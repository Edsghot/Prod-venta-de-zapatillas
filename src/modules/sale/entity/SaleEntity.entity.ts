import { User } from "src/modules/user/entity/UserEntity.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany, OneToOne } from "typeorm";
import { Cart } from "src/modules/cart/entity/CartEntity.entity";
import { Tracking } from "src/modules/traking/entity/TrackingEntity.entity"; // Added import

// Sale Entity
@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  IdSales: number;

  @ManyToOne(() => User, (user) => user.Sales)
  @JoinColumn({ name: 'userId' })
  Client: User;

  @Column({ type: 'boolean', default: false })
  ShippingMethod: boolean;

  @Column({ type: 'boolean', default: false })
  PaymentMethod: boolean;

  @Column()
  PaymentNumber: string;

  @Column()
  CardNumber: string;

  @Column({ type: 'boolean', default: false })
  Process: boolean;

  @Column('date')
  SaleDate: Date;

  @Column('double')
  Total: number;

  @ManyToOne(() => Cart, (cart) => cart.Sales)
  @JoinColumn({ name: 'cartId' })
  Cart: Cart;

  @Column()
  idShipment: number;

  @Column()
  ImagePayment: string;

  @Column()
  FollowUp: number;

  @Column({ type: 'int'})  
  Traking: number;

  @Column({ type: 'timestamp', nullable: true }) 
  TrakingDate: Date;

}
