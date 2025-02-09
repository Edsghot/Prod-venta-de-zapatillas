import { Injectable } from '@nestjs/common';
import { CreateSaleRequest } from './request/CreateSaleRequest.request';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entity/SaleEntity.entity';
import { Cart } from '../cart/entity/CartEntity.entity';
import { User } from '../user/entity/UserEntity.entity';
import * as moment from 'moment-timezone';
import { AuthValidateService } from '../auth-validate/auth-validate.service';
import { resPaymentDto } from './request/reqPaymentDto.dto';
import { ReqSuccessDto } from './request/reqSuccesDto.dto';
import { ReqErrorDto } from './request/reqErrorDto.dto';
import { DateRangeDto } from '../user/request/DateRangeDto.dto';
import { Product } from '../product/entity/ProductEntity.entity';
import { CartItem } from '../cart/entity/CartItem.entity';
import { Shipment } from '../shipment/entity/ShipmentEntity.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailValidateService: AuthValidateService

  ) { }

  async insertSale(request: CreateSaleRequest) {
    try {
      var stringPayment = ''+request.PaymentMethod;
      var stringShipping = ''+request.ShippingMethod;

      var boolPayment = false;
      var boolShippment = false;

      if(stringPayment === 'true'){
        boolPayment = true;
      }
      if(stringShipping === 'true'){
        boolShippment = true;
      }


      let sale = new Sale();
      var user = await this.userRepository.findOne({ where: { IdUser: request.IdUser, Deleted: false } })
      if (!user) {
        return { msg: 'No se encontro el usuario', success: false };
      }
      sale.Client = user;
      var cart = await this.cartRepository.findOne({ where: { IdCart: request.IdCart, Deleted: false } })
      if (!cart) {
        return { msg: 'No se encontro el carrito', success: false };
      }
      sale.Cart = cart;

      var nameMethod = "Delivery";
      sale.ShippingMethod = boolShippment;
      sale.PaymentMethod = boolPayment;
      sale.PaymentNumber = Math.floor(1000 + Math.random() * 9000).toString();
      sale.CardNumber = request.CardNumber;
      sale.Total = request.Total;
      sale.SaleDate = moment.tz('America/Lima').toDate();
      sale.idShipment = request.idShipment;
      sale.ImagePayment = request.ImagePayment;

      if(boolShippment){
        nameMethod = "Recojo en tienda";
      }

        sale.Process = true;
   
        //Actualizar el stock de cada producto del carrito
        const cartItems = await this.cartItemRepository.find({
          where: { Cart: cart },relations: ['Product']
        });
             
        if(boolPayment){
          for (const cartItem  of cartItems) {
            const product = await this.productRepository.findOne({where: { IdProduct: cartItem.Product.IdProduct,Deleted:false }});
            if (product && product.Stock >= cartItem.Quantity){
            product.Stock = product.Stock - cartItem.Quantity;
            await this.productRepository.save(product);
            }else{
              return { msg: `Stock insuficiente para el producto con ID ${cartItem.Product.IdProduct}`, success: false };
            }
          }
        }
        
        //Eliminar carrito
        cart.Deleted = true;
        
        await this.cartRepository.save(cart);
        //enviar correo de confirmacion del pago exitoso
        var res = new ReqSuccessDto();
        res.Mail = user.Mail;
        res.User = user.FirstName;
        res.Items = cartItems;
        res.Total = sale.Total;
        res.IdUser = user.IdUser;
        res.Methodship = boolShippment;
        res.MethodPayment = boolPayment;
        res.Shipment = await this.shipmentRepository.findOne({where: {IdShipment: request.idShipment}});
        res.Idcart = cart.IdCart;
        
        if(boolPayment) {
          await this.mailValidateService.sendPaymentSuccess(res);
          sale.Process = true;
        }else{
          res.Image = request.ImagePayment;
          await this.mailValidateService.sendMailQR(res);
          sale.Process = false;
        }
      
      await this.saleRepository.save(sale);
      return { msg: 'Venta insertada correctamente', success: true };
    } catch (error) {
      console.error('Error al insertar venta:', error);
      return { msg: 'Error al insertar venta', detailMsg: error.message, success: false };
    }
  }

  async getAllSales() {
    try {
      const sales = await this.saleRepository.find({relations: ['Client', 'Cart']});
      return { data: sales, msg: 'Éxito', success: true };
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      return { msg: 'Error al obtener ventas', detailMsg: error.message, success: false };
    }
  }

  async getSaleById(saleId: number) {
    try {
      const sale = await this.saleRepository.findOne({
        where: { IdSales: saleId }, relations: ['Client', 'Cart']
      });
      return { data: sale, msg: 'Éxito', success: true };
    } catch (error) {
      console.error('Error al obtener venta por ID:', error);
      return { msg: 'Error al obtener venta por ID', detailMsg: error.message, success: false };
    }
  }

  async deleteSale(saleId: number) {
    try {
      await this.saleRepository.delete(saleId);
      return { msg: 'Venta eliminado exitosamente', success: true };
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      return { msg: 'Error al eliminar venta', detailMsg: error.message, success: false };
    }
  }

  async AcceptPayment(request: resPaymentDto) {
    try {
      var user = await this.userRepository.findOne({ where: { IdUser: request.IdUser,Deleted:false } })
      if (!user) {
        return { msg: "error con el usuario" }
      }
      var cart = await this.cartRepository.findOne({ where: { IdCart: request.IdCart } })
      if (!cart) {
        return { msg: "error con el carrito" }
      }
      var sale = await this.saleRepository.findOne({ where: { Client: user, Cart: cart } });

      if (!sale) {
        return { msg: "error con la venta" }
      }
      sale.Process = true;
      await this.saleRepository.save(sale);

      //Actulizar el stock de cada producto
      const cartItems = await this.cartItemRepository.find({
        where: { Cart: cart },relations: ['Product']
      });
      for (const items of cartItems) {
        var product = await this.productRepository.findOne({ where: { IdProduct: items.Product.IdProduct, Deleted: false } });
        product.Stock = product.Stock - items.Quantity;
        await this.productRepository.save(product);
      }
      //Eliminar carrito
      cart.Deleted = true;
      await this.cartRepository.save(cart);
      //Enviar correo de confirmacion de pago, idCart

      var res = new ReqSuccessDto();
      res.Mail = user.Mail;
      res.User = user.FirstName;
      res.Items = cartItems;
      res.Total = sale.Total;
      res.IdUser = user.IdUser;
      res.Methodship = sale.ShippingMethod;
      res.MethodPayment = sale.PaymentMethod;
      res.Shipment = await this.shipmentRepository.findOne({where: {IdShipment: sale.idShipment}});
      res.Idcart = cart.IdCart;

      await this.mailValidateService.sendPaymentSuccess(res);

      return { msg: 'Se envio el correo satisfactoriamente' };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return { msg: 'Error al enviar el correo', detailMsg: error.message, success: false };
    }
  }

  async FailPayment(request: resPaymentDto) {
    try {

      var user = await this.userRepository.findOne({ where: { IdUser: request.IdUser,Deleted:false } })
      if (!user) {
        return { msg: "error con el usuario" }
      }
      var cart = await this.cartRepository.findOne({ where: { IdCart: request.IdCart } })
      if (!cart) {
        return { msg: "error con el carrito" }
      }
      var sale = await this.saleRepository.findOne({ where: { Client: user, Cart: cart } });

      if (!sale) {
        return { msg: "error con la venta" }
      }
      await this.saleRepository.delete(sale.IdSales);
      var res = new ReqErrorDto();
      res.Mail = user.Mail;
      res.user = user.FirstName;
      res.Img = sale.ImagePayment;

      await this.mailValidateService.sendPaymentError(res);

      return { msg: 'Se envio el correo satisfactoriamente' };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return { msg: 'Error al enviar el correo', detailMsg: error.message, success: false };
    }
  }

  async getSalesByDateRange(request: DateRangeDto) {
    try {
      const data = await this.userRepository.query(
        `CALL getSalesByDateRange('${request.StartDate}', '${request.EndDate}')`,
      );
      if (data && data.length > 0 && data[0].length > 0) {
        return {
          msg: 'Lista de ventas completa',
          data: data[0],
          success: true,
        };
      } else {
        return {
          msg: 'La lista de ventas está vacía',
          data: [],
          success: false,
        };
      }
    } catch (error) {
      console.error('Error al recuperar todas las ventas:', error);
      return {
        msg: 'Error al recuperar todas las ventas',
        detailMsg: error.message,
        success: false,
      };
    }
  }

  async hasClientPurchases(clientId: number): Promise<boolean> {
    const purchases = await this.saleRepository.findOne({
        where: { Client: { IdUser: clientId } }
    });
    return !!purchases;
}

  async counts() {
    try {
      const resultUser = await this.userRepository.query('SELECT COUNT(*) FROM user WHERE Rol=0 and Deleted=false');
      const numerUser = resultUser[0]['COUNT(*)'];

      const resultProduct = await this.productRepository.query('SELECT COUNT(*) FROM product where Deleted=false');
      const numberProducts = resultProduct[0]['COUNT(*)'];

      const resultProductSold = await this.cartItemRepository.query('SELECT SUM(ci.Quantity) AS TotalProductosVendidos FROM cart_item ci INNER JOIN cart c ON ci.cartIdCart = c.IdCart INNER JOIN sale s ON c.IdCart = s.cartId');
      const numberProductsSold = resultProductSold[0]['TotalProductosVendidos'];

      const ventasPorMes = await this.saleRepository
      .createQueryBuilder('sale')
      .select('MONTH(sale.saleDate)', 'Mes')
      .addSelect('COUNT(*)', 'CantidadVentas')
      .where('YEAR(sale.saleDate) = YEAR(CURRENT_DATE)')
      .groupBy('MONTH(sale.saleDate)')
      .getRawMany();

      const result = new Array(12).fill(0);

      ventasPorMes.forEach((venta) => {
        const mes = venta.Mes - 1; 
        result[mes] = venta.CantidadVentas;
      });

      return {
        msg: 'Cantidades',
        count: { numerUser, numberProducts, numberProductsSold,result },
        success: true,
      };
    } catch (error) {
      console.error('Error obteniendo las cantidades:', error);
      return {
        msg: 'Error al recuperar las cantidades',
        detailMsg: error.message,
        success: false,
      };
    }
  }
}
