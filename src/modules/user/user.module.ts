import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/UserEntity.entity';
import { ValidateService } from 'src/Common/Validate/validate.service';
import { ValidateEmailSmsEntity } from '../auth-validate/entity/ValidateEmailSms.entity';
import { Review } from './entity/ReviewEntity.entity';
import { Product } from '../product/entity/ProductEntity.entity';
import { SaleModule } from '../sale/sale.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,ValidateEmailSmsEntity,Review,Product]),forwardRef(() => SaleModule)
  ],
  providers: [UserService,ValidateService],
  controllers: [UserController]
})

export class UserModule {}
