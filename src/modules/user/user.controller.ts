import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { validate } from 'class-validator';
import { UserService } from './user.service';
import { CreateUserRequest } from './request/CreateUserRequest.request';
import { UpdateUserRequest } from './request/UpdateUserRequest.request';
import { LoginUserRequest } from './request/LoginUserRequest.request';
import { DateRangeDto } from './request/DateRangeDto.dto';
import { ValidateEmailDto } from './request/validateEmail.dto';
import { RecoverPasswordDto } from './request/recoverPassword.dto';
import { CreateReviewRequest } from '../product/request/CreateReview.request';
import { UpdateReviewRequest } from '../product/request/UpdateReview.request';
import { DeleteReview } from './request/DeleteReview.request';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/insert')
    async insertUser(@Body() createUserDto: CreateUserRequest) {
        return await this.userService.insertUser(createUserDto);
    }

    @Put('/update')
    async updateUser(@Body() updateUserDto: UpdateUserRequest) {
        return await this.userService.updateUser(updateUserDto);
    }

    @Get()
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }

    @Get('/getById/:id')
    async getUserById(@Param('id') id: number) {
        return await this.userService.getUserById(id);
    }

    @Delete('/delete/:id')
    async deleteUser(@Param('id') id: number) {
        return await this.userService.deleteUser(id);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginUserRequest) {
        const errors = await validate(loginDto);
    
        if (errors.length > 0) {
            const errorMessage = errors.map(error => Object.values(error.constraints)).join(', ');
        
            return {msg: "Error de datos de ingreso", detailMsg:errorMessage }
        }
        return await this.userService.login(loginDto.UserRequest, loginDto.Password);
    }

    @Post("/getUserByDateRange")
    async getUserByDateRange(@Body() request: DateRangeDto) {
      return await this.userService.getUserByDateRange(request);
    }

    @Post('validate')
    async validateCode(@Body() data: ValidateEmailDto) {
        var res = await this.userService.validateCode(data);
        return res;
  }
    @Put('recoverPassword')
    async recoverPassword(@Body() update: RecoverPasswordDto) {
        return await this.userService.recoverPassword(update);
    }

    @Post('CreateReview')
    async createReview(@Body() request: CreateReviewRequest) {
        return await this.userService.createReview(request);
    }

    @Get('getReviewsByProduct/:idProduct')
    async getReviewsByProduct(@Param('idProduct') idProduct: number) {
        return await this.userService.getReviewsByProduct(idProduct);
    }

    @Get('getReviewById/:idReview')
    async getReviewById(@Param('idReview') idReview: number) {
        return await this.userService.getReviewById(idReview);
    }
    @Get('GetAllReviews')
    async GetAllReviews() {
        return await this.userService.getAllReviews();
    }

    @Put('UpdateReview')
    async UpdateReview(
        @Body() request: UpdateReviewRequest
    ) {
        return await this.userService.updateReview( request);
    }

    @Delete('DeleteReview')
    async DeleteReview(@Body() review: DeleteReview) {
        return await this.userService.deleteReview(review);
    }
}
