import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateShipmentRequest } from './request/CreateShipmentRequest.request';
import { UpdateShipmentRequest } from './request/UpdateShipmentRequest.request';

@Controller('api/shipment')
export class ShipmentController {
    constructor(private readonly shipmentService: ShipmentService) {}

    @Post('/insert')
    async insertShipment(@Body() createShipmentDto: CreateShipmentRequest) {
        return await this.shipmentService.insertShipment(createShipmentDto);
    }

    @Put('/update')
    async updateShipment(@Body() updateShipmentDto: UpdateShipmentRequest) {
        return await this.shipmentService.updateShipment(updateShipmentDto);
    }

    @Get()
    async getAllShipments() {
        return await this.shipmentService.getAllShipments();
    }

    @Get('/getById/:id')
    async getShipmentById(@Param('id') id: number) {
        return await this.shipmentService.getShipmentById(id);
    }

    @Delete('/delete/:id')
    async deleteShipment(@Param('id') id: number) {
        return await this.shipmentService.deleteShipment(id);
    }

    @Get('/lastShipment/:id')
    async getLastShipment(@Param('id') id: number) {
        return await this.shipmentService.getLastShipment(id);
    }
}
