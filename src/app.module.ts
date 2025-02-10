import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { SaleModule } from './modules/sale/sale.module';
import { ProductModule } from './modules/product/product.module';
import { CloudinaryService } from './ServicesCloud/cloudinary/cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from './ServicesCloud/cloudinary/cloudinary.module';
import { CartModule } from './modules/cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { ShipmentModule } from './modules/shipment/shipment.module';
import { AuthValidateModule } from './modules/auth-validate/auth-validate.module';
import { TrakingModule } from './modules/traking/tracking.module'; // Reverted to original module name

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_DB,
      port: 43150,
      username: process.env.USERNAME_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.DATABASE_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      driver: require('mysql2'),
    }),
    UserModule,
    ProductModule,
    SaleModule,
    CloudinaryModule,
    CartModule,
    ShipmentModule,
    AuthValidateModule,
    TrakingModule, // Reverted to original module name
  ],
  controllers: [],
  providers: [CloudinaryService],
})
export class AppModule {}
