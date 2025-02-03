import { Sale } from "src/modules/sale/entity/SaleEntity.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tracking {
  @PrimaryGeneratedColumn()
  IdTracking: number; // Updated property name

  @Column()
  Estado: number;

  @Column({ type: 'date', nullable: true })
  EstimatedDate: Date;

  @Column()
  DateCreated: Date;
  
  @OneToOne(() => Sale, (sale) => sale.Tracking)
  @JoinColumn({ name: 'idSale' })
  Sale?: Sale;

  @Column()
  Deleted: boolean;
}
