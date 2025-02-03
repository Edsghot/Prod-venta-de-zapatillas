import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../sale/entity/SaleEntity.entity';
import { Tracking } from './entity/TrackingEntity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale]),TypeOrmModule.forFeature([Tracking])],
  controllers: [TrackingController],
  providers: [TrackingService]
})
export class TrakingModule {}
