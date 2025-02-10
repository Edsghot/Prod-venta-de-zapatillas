import { Injectable } from '@nestjs/common';
import { SizeProd } from './Entity/SizeEntity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSizeRequest } from '../product/request/CreateSize.request';
import { UpdateSizeRequest } from '../product/request/UpdateSizeRequest.request';

@Injectable()
export class SizeModuleService {
    constructor(
        @InjectRepository(SizeProd)
        private readonly sizeRepository: Repository<SizeProd>
      ) {
      }




    async createSize(request: CreateSizeRequest) {
        try {
            var entity = new SizeProd();
            entity.Name = request.Name;
            entity.Stock = request.Stock;
            entity.ProductId = request.IdProduct;
    
            await this.sizeRepository.save(entity);
            return { 
                msg: 'Talla creada exitosamente', 
                success: true 
            };
        } catch (error) {
            return { 
                msg: 'Error al crear talla', 
                detailMsg: error.message, 
                success: false 
            };
        }
    }
    
    async updateSize(id: number, request: UpdateSizeRequest) {
        try {
            const existingSize = await this.sizeRepository.findOne({
                where: { IdSize: id }
            });
    
            if (!existingSize) {
                return { 
                    msg: 'Talla no encontrada', 
                    success: false 
                };
            }
    
            existingSize.Name = request.Name;
            existingSize.Stock = request.Stock;
            existingSize.ProductId = request.IdProduct;
    
            await this.sizeRepository.save(existingSize);
            return { 
                msg: 'Talla actualizada exitosamente', 
                success: true 
            };
        } catch (error) {
            return { 
                msg: 'Error al actualizar talla', 
                detailMsg: error.message, 
                success: false 
            };
        }
    }
    async deleteSize(id: number) {
        try {
            const size = await this.sizeRepository.findOne({
                where: { IdSize: id }
            });

            if (!size) {
                return { 
                    msg: 'Talla no encontrada', 
                    success: false 
                };
            }

            await this.sizeRepository.remove(size);
            return { 
                msg: 'Talla eliminada exitosamente', 
                success: true 
            };
        } catch (error) {
            return { 
                msg: 'Error al eliminar talla', 
                detailMsg: error.message, 
                success: false 
            };
        }
    }

    async getAllSizes() {
        try {
            const sizes = await this.sizeRepository.find();
            return { 
                msg: 'Tallas obtenidas exitosamente',
                data: sizes, 
                success: true 
            };
        } catch (error) {
            return { 
                msg: 'Error al obtener tallas', 
                detailMsg: error.message, 
                success: false 
            };
        }
    }

    async getSizeById(id: number) {
        try {
            const size = await this.sizeRepository.findOne({
                where: { IdSize: id }
            });
            
            if (!size) {
                return { 
                    msg: 'Talla no encontrada', 
                    success: false 
                };
            }

            return { 
                msg: 'Talla encontrada',
                data: size, 
                success: true 
            };
        } catch (error) {
            return { 
                msg: 'Error al obtener talla', 
                detailMsg: error.message, 
                success: false 
            };
        }
    }

    async getSizesByProduct(productId: number) {
        try {
            const sizes = await this.sizeRepository.find({
                where: { ProductId: productId }
            });
            return { 
                msg: 'Tallas obtenidas exitosamente',
                data: sizes, 
                success: true 
            };
        } catch (error) {
            return { 
                msg: 'Error al obtener tallas del producto', 
                detailMsg: error.message, 
                success: false 
            };
        }
    }
}
