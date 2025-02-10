import { IsBoolean } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateSaleRequest{
    IdUser: number;
    IdCart: number;
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    ShippingMethod:boolean; //0:delivery   1:recojo
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    PaymentMethod:boolean; //0:yape   1:izzipay
    CardNumber:string;
    Total: number;
    idShipment:number;
    ImagePayment: string;
}