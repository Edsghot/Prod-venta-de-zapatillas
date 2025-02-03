import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AuthValidateService } from './auth-validate.service';
import { from } from 'rxjs';

@Controller('/api/mailValidation')
export class AuthValidateController {
    constructor(private readonly authService: AuthValidateService){}

    @Get()
     async sendMail(@Query('email') email: string){
        return  await this.authService.sendMail(email);
    }

    @Get('/recoverPassword')
     async sendMailRecoverPassword(@Query('email') email: string){
        return  await this.authService.sendMailRecoverPassword(email);
    }
}
