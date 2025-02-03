import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartRequest } from './request/CreateCartRequest';

@Controller('api/cart')
export class CartController {

    constructor(private readonly serviceCart: CartService){}


    @Post("/insert")
    async insertProduct(@Body() request: CreateCartRequest) {
            return this.serviceCart.insertProduct(request);
    }

    @Get('/getCartByUserId/:idUser')
    async getCartByUserId(@Param('idUser') idUser: number) {
        return await this.serviceCart.getCartByUserId(idUser);
    }

    @Delete('/deleteCartItem/:id')
    async deleteCartItem(@Param('id') id: number) {
      return await this.serviceCart.deleteCartItem(id);
    }

    @Delete('/deleteAll/:id')
    async deleteAllItem(@Param('id') id: number) {
      return await this.serviceCart.deleteAllItem(id);
    }

    @Delete('/deleteCart/:id')
    async deleteCart(@Param('id') id: number) {
      return await this.serviceCart.deleteCart(id);
    }
}
