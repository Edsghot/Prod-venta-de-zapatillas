import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateTrackingDto {
    @IsNotEmpty()
    @IsString()
    Estado: number;

    @IsDate()
    EstimatedDate?: Date;

    @IsNotEmpty()
    idSale: number; // ID de la venta asociada

    DateCreated: Date;
}
