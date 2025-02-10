import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('size_prod')  // Puedes especificar el nombre de la tabla si es diferente
export class SizeProd {
  @PrimaryGeneratedColumn()
  IdSize: number;

  @Column({ type: 'varchar', length: 255 })  // Especificando tipo y longitud
  Name: string;

  @Column({ type: 'int' })  // Especificando tipo
  Stock: number;

  @Column({ type: 'int' })  // Especificando tipo
  ProductId: number;
}
