import { User } from "src/modules/user/entity/UserEntity.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { Cart } from "src/modules/cart/entity/CartEntity.entity";
import { Tracking } from "src/modules/traking/entity/TrackingEntity.entity";

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

  @Column({ nullable: true, default: '0000' })
  PaymentNumber: string;

  @Column({ nullable: true, default: '0000' })
  CardNumber: string;

  @Column({ type: 'boolean', default: false })
  Process: boolean;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  SaleDate: Date;

  @Column('double', { default: 0 })
  Total: number;

  @ManyToOne(() => Cart, (cart) => cart.Sales)
  @JoinColumn({ name: 'cartId' })
  Cart: Cart;

  @Column({ type: 'int', default: 0, nullable: true })
  idShipment: number;

  @Column({ nullable: true, default: 'default.jpg' })
  ImagePayment: string;

  @Column({ type: 'int', default: 0, nullable: true })
  FollowUp: number;

  @Column({ type: 'int', default: 0, nullable: true })  
  Traking: number;

  @Column({ type: 'timestamp', nullable: true }) 
  TrakingDate: Date;

  @Column({ type: 'int', default: 0, nullable: true })  
  SizeId: number;
}