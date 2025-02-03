import { IsNotEmpty, IsString } from "class-validator";

export class UpdateShipmentRequest{
    @IsNotEmpty()
    @IsString()
    ShipmentId:number;

    UserId: number;

    Company: string;

    Region: string;

    Province: string;

    District: string;

    Address: string;
}