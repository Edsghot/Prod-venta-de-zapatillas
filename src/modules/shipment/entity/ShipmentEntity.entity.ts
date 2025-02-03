import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  IdShipment: number;

  @Column()
  IdUser: number;

  @Column()
  Company: string;

  @Column()
  Region: string;

  @Column()
  Province: string;

  @Column()
  District: string;

  @Column()
  Address: string;

  @Column()
  DateAdd:Date;
}