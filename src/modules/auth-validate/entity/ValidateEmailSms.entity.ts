import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Validate' })
export class ValidateEmailSmsEntity{
    @PrimaryGeneratedColumn()
    IdValidate: number;
    
    @Column()
    Email: string;
    
    @Column()
    Code: string;
}