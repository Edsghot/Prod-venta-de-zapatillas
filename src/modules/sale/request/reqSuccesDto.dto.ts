import { CartItem } from "src/modules/cart/entity/CartItem.entity";
import { Shipment } from "src/modules/shipment/entity/ShipmentEntity.entity";

export class ReqSuccessDto {
    Mail: string;
    User: string;
    Items: CartItem[];
    Total: number;
    Methodship: boolean;
    MethodPayment: boolean;
    Shipment: Shipment;
    IdUser: number;
    Idcart: number;
    Image: string;
}
