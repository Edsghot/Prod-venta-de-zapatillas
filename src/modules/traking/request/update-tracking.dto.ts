import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class UpdateTrackingDto {
    @IsNotEmpty()
    @IsNumber()
    idTracking: number;

    
    @IsNumber()
    idSale: number; 

    @IsNumber()
    Estado: number; 


    @IsDate()
    EstimatedDate: Date; 
}
