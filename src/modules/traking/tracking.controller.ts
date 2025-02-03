import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './request/create-tracking-dto.dto';
import { Tracking } from './entity/TrackingEntity.entity';
import { UpdateTrackingDto } from './request/update-tracking.dto';

@Controller('tracking')
export class TrackingController {
    constructor(private readonly trackingService: TrackingService) {}

    @Post()
    async create(@Body() createTrackingDto: CreateTrackingDto) {
        return this.trackingService.create(createTrackingDto);
    }

    @Get()
    async getAll(): Promise<Tracking[]> {
        return this.trackingService.getAll();
    }

    @Get('user/:idUser')
    async getAllByUserId(@Param('idUser') idUser: number): Promise<Tracking[]> {
        return this.trackingService.getAllByUserId(idUser);
    }
    
    @Patch()
  async update(@Body() updateTrackingDto: UpdateTrackingDto) {
    return this.trackingService.update(updateTrackingDto);
  }
}
