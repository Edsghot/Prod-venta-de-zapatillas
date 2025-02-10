import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SizeModuleService } from './size-module.service';
import { CreateSizeRequest } from '../product/request/CreateSize.request';
import { UpdateSizeRequest } from '../product/request/UpdateSizeRequest.request';

@Controller('api/size')
export class SizeModuleController {
    
    constructor(private readonly sizeService: SizeModuleService) {}
    @Post('CreateSize')
    async CreateSize(@Body() size: CreateSizeRequest) {
        return await this.sizeService.createSize(size);
    }

    @Put('UpdateSize')
    async UpdateSize(@Body() size: UpdateSizeRequest) {
        return await this.sizeService.updateSize(size.IdSize, size);
    }

    @Delete('DeleteSize/:id')
    async DeleteSize(@Param('id') id: number) {
        return await this.sizeService.deleteSize(id);
    }

    @Get('GetAllSizes')
    async GetAllSizes() {
        return await this.sizeService.getAllSizes();
    }

    @Get('GetSizeById/:id')
    async GetSizeById(@Param('id') id: number) {
        return await this.sizeService.getSizeById(id);
    }

    @Get('GetSizesByProduct/:productId')
    async GetSizesByProduct(@Param('productId') productId: number) {
        return await this.sizeService.getSizesByProduct(productId);
    }

}
