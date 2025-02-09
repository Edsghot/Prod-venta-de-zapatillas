import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

Entity('sizes')
export class Size {
    @PrimaryGeneratedColumn()
    IdSize: number;

    @Column()
    Name: string;

    @Column()
    Stock: number;

    @Column()
    IdProduct: number;

}
