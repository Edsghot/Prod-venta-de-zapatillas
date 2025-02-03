import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entity/ProductEntity.entity';
import { User } from '../user/entity/UserEntity.entity';
import { Cart } from './entity/CartEntity.entity';
import { CartItem } from './entity/CartItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Cart]),TypeOrmModule.forFeature([CartItem])
  ],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
