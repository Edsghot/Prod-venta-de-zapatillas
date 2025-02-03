import { IsNotEmpty, IsString } from "class-validator";

export class CreateShipmentRequest{
    @IsNotEmpty()
    @IsString()
    IdUser: number;

    Company: string;

    Region: string;

    Province: string;

    District: string;

    Address: string;
    DateAdd:Date;
}