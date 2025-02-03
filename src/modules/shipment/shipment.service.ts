import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipment } from './entity/ShipmentEntity.entity';
import { Repository } from 'typeorm';
import { CreateShipmentRequest } from './request/CreateShipmentRequest.request';
import { UpdateShipmentRequest } from './request/UpdateShipmentRequest.request';
import * as moment from 'moment-timezone';
import { User } from '../user/entity/UserEntity.entity';

@Injectable()
export class ShipmentService {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: Repository<Shipment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      ) {
      }

      async insertShipment(request: CreateShipmentRequest) {
        try {
            request.DateAdd=moment.tz('America/Lima').toDate();
            const newShipment = this.shipmentRepository.create(request);
            
            var shipmentCreado=await this.shipmentRepository.save(newShipment);
            return { msg: 'Envio insertado correctamente',data:shipmentCreado.IdShipment, success: true };
          } catch (error) {
            console.error('Error al insertar envio:', error);
            return { msg: 'Error al insertar envio', detailMsg: error.message, success: false };
          }
      }

      async updateShipment(updateShipmentDto: UpdateShipmentRequest) {
        try {
          const shipment = await this.shipmentRepository.findOne({
            where: { IdShipment: updateShipmentDto.ShipmentId}
          });
    
          if (!shipment) {
            return { msg: 'Envio no encontrado', success: false };
          }
          const user = await this.userRepository.findOne({
            where: { IdUser: updateShipmentDto.UserId },
          });
          if (!user) {
            return { msg: 'Usuario no encontrado', success: false };
          }
    
          shipment.Company=updateShipmentDto.Company;
          shipment.Region=updateShipmentDto.Region;
          shipment.Province=updateShipmentDto.Province;
          shipment.District=updateShipmentDto.District;
          shipment.Address=updateShipmentDto.Address;
          
          await this.shipmentRepository.save(shipment);
    
          return { msg: 'Envio actualizado exitosamente', success: true };
        } catch (error) {
          console.error('Error al actualizar envio:', error);
          return { msg: 'Error al actualizar envio', detailMsg: error.message, success: false };
        }
      }

      async getAllShipments() {
        try {
          const shipments = await this.shipmentRepository.find();
          return { data: shipments, msg: 'Éxito', success: true };
        } catch (error) {
          console.error('Error al obtener envios:', error);
          return { msg: 'Error al obtener envios', detailMsg: error.message, success: false };
        }
      }

      async getShipmentById(shipmentId: number) {
        try {
          const shipment = await this.shipmentRepository.findOne({
            where: { IdShipment: shipmentId },
          });
          return { data: shipment, msg: 'Éxito', success: true };
        } catch (error) {
          console.error('Error al obtener envio por ID:', error);
          return { msg: 'Error al obtener envio por ID', detailMsg: error, success: false };
        }
      }

      async deleteShipment(shipmentId: number) {
        try {
          await this.shipmentRepository.delete(shipmentId);
          return { msg: 'Envio eliminado exitosamente', success: true };
        } catch (error) {
          console.error('Error al eliminar envio:', error);
          return { msg: 'Error al eliminar envio', detailMsg: error, success: false };
        }
      }

      async getLastShipment(userId:number){
        try{
            const user = await this.userRepository.findOne({
                where: { IdUser: userId },
              });
              if (!user) {
                return { msg: 'Usuario no encontrado', success: false };
              }
            const data = await this.shipmentRepository.query(
                `CALL getLastShipment('${userId}');`,
              );
              if (data && data.length > 0 && data[0].length > 0) {
                return {
                  msg: 'El ultimo envio del usuario '+userId,
                  data: data[0],
                  success: true,
                };
              } else {
                return {
                  msg: 'No hay envios del usuario'+userId,
                  data: [],
                  success: false,
                };
              }
        }catch (error) {
          console.error('Error al obtener el ultimo envio por usuario:', error);
          return { msg: 'Error al  obtener el ultimo envio por usuario', detailMsg: error, success: false };
        }
      }
}
