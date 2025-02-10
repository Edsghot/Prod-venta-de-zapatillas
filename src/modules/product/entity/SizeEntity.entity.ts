import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

Entity()
export class SizeProd {
    @PrimaryGeneratedColumn()
    IdSize: number;

    @Column()
    Name: string;

    @Column()
    Stock: number;

    @Column()
    IdProduct: number;

}
