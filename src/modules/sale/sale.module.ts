import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { Sale } from './entity/SaleEntity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../cart/entity/CartEntity.entity';
import { User } from '../user/entity/UserEntity.entity';
import { AuthValidateService } from '../auth-validate/auth-validate.service';
import { CloudinaryService } from 'src/ServicesCloud/cloudinary/cloudinary.service';
import { ValidateEmailSmsEntity } from '../auth-validate/entity/ValidateEmailSms.entity';
import { Product } from '../product/entity/ProductEntity.entity';
import { CartItem } from '../cart/entity/CartItem.entity';
import { Shipment } from '../shipment/entity/ShipmentEntity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale],),TypeOrmModule.forFeature([Cart]),TypeOrmModule.forFeature([CartItem]),TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([ValidateEmailSmsEntity]),TypeOrmModule.forFeature([Product]),TypeOrmModule.forFeature([Shipment])
  ],
  providers: [SaleService,AuthValidateService,CloudinaryService],
  controllers: [SaleController]
})
export class SaleModule {}
