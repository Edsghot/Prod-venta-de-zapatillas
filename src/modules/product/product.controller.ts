import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductRequest } from './request/CreateProductRequest.request';
import { UpdateProductRequest } from './request/UpdateProductRequest.request';
import { FileInterceptor } from '@nestjs/platform-express';
import { FOLDER_PAYMENT } from 'src/Common/constants/constantService';
import { CloudinaryService } from 'src/ServicesCloud/cloudinary/cloudinary.service';

@Controller('api/product')
export class ProductController {
    constructor(private readonly productService: ProductService, private cloudinaryService: CloudinaryService) {}

    @Post('/insert')
    @UseInterceptors(FileInterceptor('file'))
    async insert(
      @Body() request: CreateProductRequest,
      @UploadedFile() file?: Express.Multer.File) {
        try {
            var res = await this.cloudinaryService.uploadFile(file, FOLDER_PAYMENT);
            request.UrlImage = res.secure_url;

            return await this.productService.insertProduct(request);
        } catch (e) {
            return { msg: "Error al guardar la imagen", success: false, msgDetail: e.msg };
        }
    }
  
    @Put('/update')
    @UseInterceptors(FileInterceptor('file'))
    async updateProduct(
      @Body() updateProductDto: UpdateProductRequest,
      @UploadedFile() file?: Express.Multer.File) {
      try {
        if (file) {
          var res = await this.cloudinaryService.uploadFile(file, FOLDER_PAYMENT);
          updateProductDto.UrlImage = res.secure_url;
        }

        return await this.productService.updateProduct(updateProductDto);
      } catch (e) {
          return { msg: "Error al guardar la imagen", success: false, msgDetail: e.msg };
      }
    }
  
    @Get()
    async getAllProducts() {
      return await this.productService.getAllProducts();
    }
  
    @Get('/getById/:id')
    async getProductById(@Param('id') id: number) {
      return await this.productService.getProductById(id);
    }
  
    @Delete('/delete/:id')
    async deleteProduct(@Param('id') id: number) {
      return await this.productService.deleteProduct(id);
    }
}
