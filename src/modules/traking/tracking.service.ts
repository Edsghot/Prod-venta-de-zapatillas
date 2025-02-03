import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tracking } from './entity/TrackingEntity.entity'; // Updated import
import { Repository } from 'typeorm';
import { Sale } from '../sale/entity/SaleEntity.entity';
import { CreateTrackingDto } from './request/create-tracking-dto.dto'; // Updated import
import { UpdateTrackingDto } from './request/update-tracking.dto'; // Updated import

@Injectable()
export class TrackingService {

    constructor(
        @InjectRepository(Tracking)
        private readonly trackingRepository: Repository<Tracking>,
        
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
      ) {}

      async create(createTrackingDto: CreateTrackingDto) {
        const sale = await this.saleRepository.findOneBy({ IdSales: createTrackingDto.idSale });
        if (!sale) {
          return {msg: 'Sale no encontrado',type: 'error'};
        }
        const track=createTrackingDto;
        track.DateCreated=new Date();
        const tracking = this.trackingRepository.create({
          ...track,
          Sale: sale,
        });
        await this.trackingRepository.save(tracking);
        return {msg: 'Tracking creado',type: 'success',data:tracking};
      }

      async getAll(): Promise<Tracking[]> {
        return await this.trackingRepository.find({ relations: ['Sale'] }); 
      }

      async getAllByUserId(idUser: number): Promise<Tracking[]> {
        const sales = await this.saleRepository.find({ where: { Client: { IdUser: idUser } }, relations: ['Tracking'] });
        
        return sales.map(sale => sale.Tracking).filter(tracking => tracking !== undefined); 
      }

      async update(updateTrackingDto: UpdateTrackingDto) {
        const tracking = await this.trackingRepository.findOneBy({ IdTracking: updateTrackingDto.idTracking }); // Updated reference
    
        if (!tracking) {
          return {msg: 'Tracking no encontrado',type: 'error'};
        }
    
        if (updateTrackingDto.idSale) {
          const sale = await this.saleRepository.findOneBy({ IdSales: updateTrackingDto.idSale });
          if (!sale) {
            return {msg: 'Venta no encontrada',type: 'error'};
          }
          tracking.Sale = sale;
        }
    
        if (updateTrackingDto.Estado !== undefined) {
          tracking.Estado = updateTrackingDto.Estado;
        }
    
        if (updateTrackingDto.EstimatedDate) {
          tracking.EstimatedDate = updateTrackingDto.EstimatedDate; 
        }
        
        await this.trackingRepository.save(tracking);
        return {msg: 'Tracking actualizado',type: 'success',data:tracking};
      }
}
