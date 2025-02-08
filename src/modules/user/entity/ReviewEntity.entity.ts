import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    IdReview: number;

    @Column()
    IdProduct: number;

    @Column()
    NameClient: string;

    @Column()
    IdClient: number;

    @Column()
    starts: number;

    @Column()
    Comment: string;

    @Column()
    Date: Date;
}
