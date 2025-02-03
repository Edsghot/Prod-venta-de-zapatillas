import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/UserEntity.entity';
import { ValidateService } from 'src/Common/Validate/validate.service';
import { ValidateEmailSmsEntity } from '../auth-validate/entity/ValidateEmailSms.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([ValidateEmailSmsEntity]),
  ],
  providers: [UserService,ValidateService],
  controllers: [UserController]
})
export class UserModule {}
