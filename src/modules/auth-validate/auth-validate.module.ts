import { Module } from '@nestjs/common';
import { AuthValidateService } from './auth-validate.service';
import { AuthValidateController } from './auth-validate.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/UserEntity.entity';
import { Sale } from '../sale/entity/SaleEntity.entity';
import { ValidateEmailSmsEntity } from './entity/ValidateEmailSms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ValidateEmailSmsEntity]),
    MailerModule.forRoot(
      {
        transport: {
          service: 'gmail',
          auth:{
            user: 'josephpolixarpoperalta@gmail.com',
            pass: 'yiue zprw mfog xuty'
          }
        }
      }
    ),TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Sale])
  ],
  providers: [AuthValidateService],
  controllers: [AuthValidateController]
})
export class AuthValidateModule {}
