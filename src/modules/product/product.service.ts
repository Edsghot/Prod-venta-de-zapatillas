import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/ProductEntity.entity';
import { CreateProductRequest } from './request/CreateProductRequest.request';
import { UpdateProductRequest } from './request/UpdateProductRequest.request';
import { Review } from '../user/entity/ReviewEntity.entity';
import moment from 'moment';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
    ) {}

    async insertProduct(request: CreateProductRequest) {
        try {
            const newProduct = this.productRepository.create(request);
            newProduct.Deleted = false;

            // Handle sizes if provided
            

            await this.productRepository.save(newProduct);
            return { msg: 'Producto insertado correctamente', success: true };
        } catch (error) {
            console.error('Error al insertar producto:', error);
            return { msg: 'Error al insertar producto', detailMsg: error.message, success: false };
        }
    }

    async updateProduct(updateProductDto: UpdateProductRequest) {
        console.log('Updating product with data:', updateProductDto); // Logging incoming data
        try {
            const product = await this.productRepository.findOne({
                where: { IdProduct: updateProductDto.IdProduct, Deleted: false },
            });

            if (!product) {
                return { msg: 'Producto no encontrado', success: false };
            }

            // Update product properties
            product.Description = updateProductDto.Description;
            product.Name = updateProductDto.Name;
            product.NutritionalInformation = updateProductDto.NutritionalInformation;
            product.Price = updateProductDto.Price;
            product.Stock = updateProductDto.Stock;
            product.Visible = updateProductDto.Visible;
            product.UrlImage = updateProductDto.UrlImage;
            product.Category = updateProductDto.Category;
            product.Talla = updateProductDto.Talla; 
            product.Marca = updateProductDto.Marca; 
            product.Genero = updateProductDto.Genero; 
            product.Color = updateProductDto.Color;
            product.Sku = updateProductDto.Sku; 
            product.Discount = updateProductDto.Discount;

            // Handle sizes if provided
            

            await this.productRepository.save(product);
            console.log('Product updated successfully:', product); // Logging successful update

            return { msg: 'Producto actualizado exitosamente', success: true };
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            return { msg: 'Error al actualizar producto', detailMsg: error.message, success: false };
        }
    }

    async getAllProducts() {
        try {
            const products = await this.productRepository.find({ where: { Deleted: false } });
            return { data: products, msg: 'Éxito', success: true };
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return { msg: 'Error al obtener productos', detailMsg: error.message, success: false };
        }
    }

    async getProductById(productId: number) {
        try {
            const product = await this.productRepository.findOne({
                where: { IdProduct: productId, Deleted: false },
            });

            return product
                ? { data: product, msg: 'Éxito', success: true }
                : { msg: 'Producto no encontrado', success: false };
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            return { msg: 'Error al obtener producto', detailMsg: error.message, success: false };
        }
    }

    async deleteProduct(productId: number) {
        try {
            var product = await this.productRepository.findOne({
                where: { IdProduct: productId, Deleted: false }
            });
            if (!product) {
                return { msg: 'No se encontró producto', success: false };
            }
            product.Deleted = true;
            await this.productRepository.save(product);
            return { msg: 'Producto eliminado exitosamente', success: true };
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return { msg: 'Error al eliminar producto', detailMsg: error.message, success: false };
        }
    }

    async countProducts() {
        try {
            const result = await this.productRepository.query('SELECT COUNT(*) FROM product ');
            const count = result[0]['COUNT(*)'];
            return {
                msg: 'Cantidad de productos',
                count: count,
                success: true,
            };
        } catch (error) {
            console.error('Error obteniendo la cantidad de clientes:', error);
            return {
                msg: 'Error al recuperar la cantidad de clientes',
                detailMsg: error.message,
                success: false,
            }; 
        }
    }

  
}
