import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateService } from 'src/Common/Validate/validate.service';
import { UserService } from '../user/user.service';
import { Product } from './entity/ProductEntity.entity';
import { ProductService } from './product.service';
import { CloudinaryService } from 'src/ServicesCloud/cloudinary/cloudinary.service';
import { Review } from '../user/entity/ReviewEntity.entity';
import { SizeProd } from './entity/SizeEntity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),TypeOrmModule.forFeature([SizeProd])
  ],
  providers: [ProductService,CloudinaryService],
  controllers: [ProductController]
})
export class ProductModule {}
