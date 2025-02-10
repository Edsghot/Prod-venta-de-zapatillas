import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './request/create-tracking-dto.dto';
import { Tracking } from './entity/TrackingEntity.entity';
import { UpdateTrackingDto } from './request/update-tracking.dto';

@Controller('tracking')
export class TrackingController {
    constructor(private readonly trackingService: TrackingService) {}

}
