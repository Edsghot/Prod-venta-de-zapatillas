import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    IdProduct: number;

    @Column()
    Name: string;

    @Column()
    Description: string;

    @Column()
    NutritionalInformation: string;

    @Column()
    Price: number;

    @Column()
    Stock: number;

    @Column()
    UrlImage: string;

    @Column()
    Category: string;

    @Column({ default: false })
    Deleted: boolean;

    @Column()
    Talla: string; // New field for size

    @Column()
    Marca: string; // New field for brand

    @Column()
    Genero: string;

    @Column()
    Color: string;

    @Column()
    Sku: number;

    @Column()
    Discount: number;

    @Column({ default: true })
    Visible: boolean; // Ensure the Visible field is included

   
}
