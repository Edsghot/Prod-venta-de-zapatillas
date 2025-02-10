import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleRequest } from './request/CreateSaleRequest.request';
import { resPaymentDto } from './request/reqPaymentDto.dto';
import { CloudinaryService } from 'src/ServicesCloud/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FOLDER_PAYMENT } from 'src/Common/constants/constantService';
import { DateRangeDto } from '../user/request/DateRangeDto.dto';
import { TrakingUpdateRequest } from './request/TrakingUpdateRequest.request';

@Controller('api/sale')
export class SaleController {
    constructor(private readonly saleService: SaleService,
        private cloudinaryService: CloudinaryService){}

    @Post("/insert")
    @UseInterceptors(FileInterceptor('file'))
    async insertSale(
        @Body() request: CreateSaleRequest,
        @UploadedFile() file?: Express.Multer.File) {


            if(!file){
                return this.saleService.insertSale(request);
            } else{
                var res = await this.cloudinaryService.uploadFile(file, FOLDER_PAYMENT);

                request.ImagePayment = res.secure_url;
                return this.saleService.insertSale(request);
            }
    }

    @Get()
    async getAllSales() {
        return await this.saleService.getAllSales();
    }z

    @Get('/getById/:id')
    async getSaleById(@Param('id') id: number) {
        return await this.saleService.getSaleById(id);
    }

    @Delete('/delete/:id')
    async deleteSale(@Param('id') id: number) {
        return await this.saleService.deleteSale(id);
    }

    @Get('/acceptPayment/:IdCart/:IdUser')
    async success(@Param() params: resPaymentDto) {
        return await this.saleService.AcceptPayment(params);
    }

    @Get('/failPayment/:IdCart/:IdUser')
    async Fail(@Param() params: resPaymentDto) {
        return await this.saleService.FailPayment(params);
    }

    @Post("/getSalesByDateRange")
    async getSalesByDateRange(@Body() request: DateRangeDto) {
      return await this.saleService.getSalesByDateRange(request);
    }
    @Put("/updateTraking")
    async updateTrakingData(@Body() request: TrakingUpdateRequest) {
      return await this.saleService.updateTraking(request);
    }

    @Get("/counts")
    async counts() {
      return await this.saleService.counts();
    }

    @Get('/ValidateReview/:clientId')
    async ValidateReview(@Param('clientId') clientId: number) {
        return await this.saleService.validateReview(clientId);
    }

    @Get('/History/:clientId')
    async GetHistory(@Param('clientId') clientId: number) {
        return await this.saleService.GetHistory(clientId);
    }
}
