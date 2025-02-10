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


}
