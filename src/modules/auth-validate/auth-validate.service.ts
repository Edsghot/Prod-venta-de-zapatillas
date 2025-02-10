
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CORREO } from 'src/Common/constants/constantService';

import { Repository } from 'typeorm';
import { CreateSaleRequest } from '../sale/request/CreateSaleRequest.request';
import { User } from '../user/entity/UserEntity.entity';
import { ResMessage } from '../sale/request/ResMessage.dto';
import { ReqSuccessDto } from '../sale/request/reqSuccesDto.dto';
import { ReqErrorDto } from '../sale/request/reqErrorDto.dto';
import { ValidateEmailSmsEntity } from './entity/ValidateEmailSms.entity';
import { truncateSync } from 'fs';

@Injectable()
export class AuthValidateService {
    constructor(
      private readonly mailerService: MailerService,
      @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      @InjectRepository(ValidateEmailSmsEntity) 
        private validateRepository: Repository<ValidateEmailSmsEntity>,
    ){
}

    async sendMailQR(request: ReqSuccessDto){
        var res = new ResMessage();
        var user = await this.userRepository.findOne({ where: { IdUser: request.IdUser } })

         await this.mailerService.sendMail(
            {
                to: CORREO,
                from: 'josephpolixarpoperalta@gmail.com',
                subject: `PAGO POR ACEPTAR....`,
                text: 'Welcome a  Moda & Estilo',
                html: `<div
  style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  "
>
  <div
    style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    "
  >
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 15px;
        background-color: #c04751;
        border-bottom: 2px solid #f0f0f0;
      "
    >
      <h1 style="font-size: 24px; margin: 0; font-weight: bolder">
        <span style="color: #fff">Moda y Estilo </span>
      </h1>
    </div>
    <div style="padding: 20px; text-align: justify">
      <h2 style="font-size: 22px; color: #333333">
        <span style="color: #1a7eb9">Hola, </span> ${CORREO} 🚀
      </h2>
      <p style="font-size: 16px; color: #555555">
        Has recibido una solicitud de compra para productos. 📝 Te solicitamos
        revisar detalladamente el comprobante de pago adjunto para proceder con
        la confirmación de compra. Una vez verificado el voucher de pago,
        procederemos a completar la solicitud. ✅
      </p>
      <div style="margin-top: 30px; font-size: 16px; color: #000">
        <p>
          <span style="font-weight: bold; color: #f92f60; margin-bottom: 13px"
            >Nombres:</span
          >${user.FirstName} <br />
          <span style="font-weight: bold; color: #f92f60; margin-bottom: 13px"
            >Apellidos:</span
          >
          ${user.LastName} <br />
          <span style="font-weight: bold; color: #f92f60; margin-bottom: 13px"
            >Teléfono:</span
          >
          ${user.Phone} <br />
          <span style="font-weight: bold; color: #f92f60; margin-bottom: 13px"
            >Gmail:</span
          >
          ${user.Mail} <br />
          <span style="font-weight: bold; color: #f92f60; margin-bottom: 13px"
            >Total:</span
          >${request.Total} <br />
          <span style="font-weight: bold; color: #f92f60; margin-bottom: 13px"
            >Voucher:</span
          >
          <img
            src=${request.Image}
            alt="User Image"
            style="width: 300px; height: auto; margin-left: 10px"
          />
        </p>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px">
          <a
            href="http://localhost:5039/api/sale/acceptPayment/${request.Idcart}/${request.IdUser}"
            style="
              background-color: #f92f60;
              color: #ffffff;
              margin-right: 10px;
              border: none;
              padding: 10px 20px;
              font-size: 16px;
              cursor: pointer;
              border-radius: 4px;
            "
          >
            Confirmar Compra
          </a>
          <a
            href="http://localhost:5039/api/sale/failPayment/${request.Idcart}/${request.IdUser}"
            style="
              background-color: #333;
              color: #ffffff;
              border: none;
              padding: 10px 20px;
              font-size: 16px;
              cursor: pointer;
              border-radius: 4px;
            "
          >
            Rechazar Compra
          </a>
        </div>
      </div>
    </div>
    <div
      style="
        text-align: center;
        padding: 5px;
        background-color: #575d5e;
        border-top: 2px solid #f0f0f0;
      "
    >
      <p style="font-size: 14px; color: #fff; margin: 10px 0">
        Enviado por Moda y Estilo
      </p>
    </div>
  </div>
</div>
`,
            }
        )
        return res.resultOK("Se envio correctamente");
    }
    
    

    async sendPaymentSuccess(request: ReqSuccessDto){
        var res = new ResMessage();

          // Construir la lista de productos en HTML
  const itemsHtml = request.Items.map(item => `
    <li>
      Producto: ${item.Product.Name} <br>
      Cantidad: ${item.Quantity} <br>
    </li>
  `).join('');

    var metodoPago = 'PAGO CON YAPE ';
    if(request.MethodPayment){
      metodoPago =' PAGO CON TARJETA'
    }
    var metodoEnvio = 'RECOJO EN TIENDA';
    var ubicacion = request.Shipment.Address+', Abancay';


    if(request.Methodship === false){
      metodoEnvio = 'ENVIO'
      ubicacion =  request.Shipment.District +', '+request.Shipment.Province + ',' + request.Shipment.Region 
    }



  await this.mailerService.sendMail({
    to: request.Mail,
    from: 'josephpolixarpoperalta@gmail.com',
    subject: `PAGO CONFIRMADO`,
    text: 'welcome a Moda & Estilo',
    html: `<div
  style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  "
>
  <div
    style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    "
  >
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 15px;
        background-color: #c04751;
        border-bottom: 2px solid #f0f0f0;
      "
    >
      <h1 style="font-size: 24px; margin: 0; font-weight: bolder">
        <span style="color: #fff">Moda y Estilo</span>
      </h1>
    </div>
    <div style="padding: 20px; text-align: justify">
      <h2 style="font-size: 22px; color: #333333">
        <span style="color: #c04751">Hola, </span> ${request.User}! 🚀
      </h2>
      <p style="font-size: 16px; color: #555555">
        Nos complace informarte que tu compra ha sido revisado y aceptado 
        con éxito. 🎉
      </p>

      <div
        style="
          margin-top: 20px;
          padding: 20px;
          border: 1px dashed #c0c0c0;
          background-color: #ffffff;
          text-align: center;
        "
      >
        <p style="color: #c04751; font-weight: bold; font-size: 18px">
          🧾 Detalles de tu compra:
        </p>

        <p style="color: #000; margin: 5px 0">
          <strong>Método de envío:</strong> ${metodoEnvio} <br />
          <strong>Ubicación:</strong> ${ubicacion}
        </p>

        <p style="color: #000; margin: 5px 0">
          <strong>Método de pago:</strong> ${metodoPago}
        </p>

        <ul
          style="
            color: #000;
            list-style-type: none;
            padding: 0;
            margin: 15px 0;
            text-align: left;
          "
        >
          ${itemsHtml}
        </ul>

        <p style="color: #000; margin: 10px 0; font-weight: bold">
          Total: ${request.Total}
        </p>

        <div
          style="
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #c0c0c0;
            font-size: 12px;
            color: #777777;
          "
        >
          <p style="margin: 0">[───────────── Corte aquí ─────────────]</p>
          <p style="margin: 0">
            Este es tu comprobante de compra. ¡Gracias por tu compra en Moda y Estilo!
          </p>
        </div>
      </div>
    </div>
    <div
      style="
        text-align: center;
        padding: 5px;
        background-color: #575d5e;
        border-top: 2px solid #f0f0f0;
      "
    >
      <p style="font-size: 14px; color: #fff; margin: 10px 0">
        Enviado por Moda y Estilo 
      </p>
    </div>
  </div>
</div>
`,
    });
  return res.resultOK("Se envio correctamente");
    }

    async sendTracking(customerEmail: string, trackingNumber: number) {
      var res = new ResMessage();
  
      let statusMessage = '';
      switch(trackingNumber) {
          case 0:
              statusMessage = 'Pedido recibido';
              break;
          case 1:
              statusMessage = 'En preparación';
              break;
          case 2:
              statusMessage = 'En tránsito';
              break;
          case 3:
              statusMessage = 'Entregado';
              break;
          case 4:
              statusMessage = 'Cancelado';
              break;
          case 5:
              statusMessage = 'En espera';
              break;
          default:
              statusMessage = 'Estado desconocido';
              break;
      }
  
      await this.mailerService.sendMail(
          {
              to: customerEmail, // Aquí se utiliza el correo que se pasa como parámetro
              from: 'josephpolixarpoperalta@gmail.com',
              subject: `Estado del pedido: ${statusMessage}`,
              text: `Estado del pedido: ${statusMessage}`,
              html: `<div
    style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 15px;
          background-color: #c04751;
          border-bottom: 2px solid #f0f0f0;
        "
      >
        <h1 style="font-size: 24px; margin: 0; font-weight: bolder">
          <span style="color: #fff">Moda y Estilo</span>
        </h1>
      </div>
      <div style="padding: 20px; text-align: justify">
        <h2 style="font-size: 22px; color: #333333">
          <span style="color: #1a7eb9">Hola, </span> ${customerEmail} 🚀
        </h2>
        <p style="font-size: 16px; color: #555555">
          Tu pedido está en estado: <strong>${statusMessage}</strong>. 📝
        </p>
      </div>
      <div
        style="
          text-align: center;
          padding: 5px;
          background-color: #575d5e;
          border-top: 2px solid #f0f0f0;
        "
      >
        <p style="font-size: 14px; color: #fff; margin: 10px 0">
          Enviado por Moda y Estilo
        </p>
      </div>
    </div>
  </div>
  `,
          }
      );
      return res.resultOK("Correo enviado correctamente");
  }
  

    async sendPaymentError(request: ReqErrorDto){
        var res = new ResMessage();

         await this.mailerService.sendMail(
            {
                to: request.Mail,
                from: 'josephpolixarpoperalta@gmail.com',
                subject: `PAGO ERRONEO`,
                text: 'Welcome a Moda y Estilo',
                html: `<div
  style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  "
>
  <div
    style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    "
  >
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 15px;
        background-color: #c04751;
        border-bottom: 2px solid #f0f0f0;
      "
    >
      <h1 style="font-size: 24px; margin: 0; font-weight: bolder">
        <span style="color: #fff">Moda y Estilo</span>
      </h1>
    </div>
    <div style="padding: 20px; text-align: justify">
      <h2 style="font-size: 22px; color: #333333">
        <span style="color: #c04751">Hola, </span> ${request.user}! 🚀
      </h2>
      <p style="font-size: 16px; color: #555555">
        Hemos revisado el comprobante de pago adjunto y lamentablemente no
        podemos proceder con la confirmación de tu compra en este momento. ❌
        Por favor, verifica nuevamente el voucher de pago adjunto y asegúrate de
        que todos los detalles sean correctos. 📝 Y realiza nuevamente la
        compra. 🛒
      </p>

      <span style="font-weight: bold; color: #f92f60; margin-bottom: 13px"
        >Voucher:</span
      >
      <img
        src=${request.Img}
        alt="User Image"
        style="width: 300px; height: auto; margin-left: 10px"
      />
    </div>
    <div
      style="
        text-align: center;
        padding: 5px;
        background-color: #575d5e;
        border-top: 2px solid #f0f0f0;
      "
    >
      <p style="font-size: 14px; color: #fff; margin: 10px 0">
        Enviado por Moda & Estilo
      </p>
    </div>
  </div>
</div>
`,
            }
        )
        return res.resultOK("Se envio correctamente");
    }
    async sendMail(email: string){
      try{
      const userMail = await this.userRepository.findOne({ where: { Mail: email,Deleted:false } });
  
      if (userMail) {
        return { msg: "Ya se registró un usuario con ese EMAIL", success: false, data: null };
      }
      var res = new ResMessage();

      var code = Math.floor(100000 + Math.random() * 900000).toString();
      
      var existing = await this.validateRepository.findOne({
          where: {Email:email}
      })

      if(existing != null){
          await this.validateRepository.delete(existing);
      }

      var nuevo = new ValidateEmailSmsEntity();
          nuevo.Email = email;
          nuevo.Code = code;
          const newValidate = this.validateRepository.create(nuevo)
          await this.validateRepository.save(newValidate)

      var nameEmail = this.obtenerNombreEmail(email);

       await this.mailerService.sendMail(
          {
              to: email,
              from: 'josephpolixarpoperalta@gmail.com',
              subject: `Tu código de verificación es: ${code}`,
              text: 'Welcome a tiendas MODA & ESTILO',
              html: ` <div
  style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f4f4;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 0;
  "
>
  <div
    style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    "
  >
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 20px;
        background-color: #eff2f4;
        border-bottom: 2px solid #f0f0f0;
      "
    >
      <img
        src="https://jhedgost.com/logo.png"
        alt="jhedgost Logo"
        style="
          margin-right: 10px;
          width: 50px;
          height: auto;
          border-radius: 20%;
        "
      />
      <h1 style="font-size: 24px; margin: 0; font-weight: bolder">
        <span style="color: #10446f">JHED</span>
        <span style="color: #1a7eb9">GOST</span>
      </h1>
    </div>
    <div style="padding: 20px; text-align: justify">
      <h2 style="font-size: 22px; color: #333333">
        <span style="color: #1a7eb9">Hola, </span> ${nameEmail}
      </h2>
      <p style="font-size: 16px; color: #555555">
        ✅ ¡Gracias por registrarte para obtener una cuenta en MODA Y ESTILO! ⭐
        Antes de comenzar, necesitamos confirmar tu identidad. Por favor, copia
        el siguiente código e introdúcelo en la aplicación para verificar tu
        dirección de correo electrónico: ⬇️🔑
      </p>
      <div
        style="
          background-color: #eff2f4;
          padding: 5px;
          border-radius: 8px;
          margin-top: 10px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #333333;
        "
      >
        <p>${code}</p>
      </div>
    </div>
    <div
      style="
        text-align: center;
        padding: 20px;
        background-color: #27567d;
        border-top: 2px solid #f0f0f0;
      "
    >
      <p style="font-size: 14px; color: #fff; margin: 10px 0">
        Nunca pares de aprender,<br />
        Team JhedGost.
      </p>
      <img
        src="https://jhedgost.com/logo.png"
        alt="Jhedgost Logo"
        style="
          margin-top: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        "
      />
      <p style="font-size: 14px; color: #fff; margin: 10px 0">
        Enviado por JHEDGOST Av. Manuel Olguin Nro. 325, Abancay, Perú 2025
      </p>
    </div>
  </div>
</div>
`,
          }
      )
      return {msg:"Se envio correctamente el codigo de verificación a tu correo", success: true}
     }catch(e){
      return {msg:"Error no se pudo encontrar tu correo verifique este bien escrito", success: false}
     }
  }

  async sendMailRecoverPassword(email: string){
    try{
      var res = new ResMessage();

      var code = Math.floor(100000 + Math.random() * 900000).toString();
      
      var existing = await this.validateRepository.findOne({
          where: {Email:email}
      })

      if(existing != null){
          await this.validateRepository.delete(existing);
      }

      var nuevo = new ValidateEmailSmsEntity();
          nuevo.Email = email;
          nuevo.Code = code;
          const newValidate = this.validateRepository.create(nuevo)
          await this.validateRepository.save(newValidate)

      var nameEmail = this.obtenerNombreEmail(email);

       await this.mailerService.sendMail(
          {
              to: email,
              from: 'josephpolixarpoperalta@gmail.com',
              subject: `Tu código de recuperación es: ${code}`,
              text: 'Recuperacion de contraseña Moda y Estilo',
              html: ` <div
  style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f4f4;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 0;
  "
>
  <div
    style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    "
  >
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 20px;
        background-color: #eff2f4;
        border-bottom: 2px solid #f0f0f0;
      "
    >
      <img
        src="https://jhedgost.com/logo.png"
        alt="jhedgost Logo"
        style="
          margin-right: 10px;
          width: 50px;
          height: auto;
          border-radius: 20%;
        "
      />
      <h1 style="font-size: 24px; margin: 0; font-weight: bolder">
        <span style="color: #10446f">JHED</span>
        <span style="color: #1a7eb9">GOST</span>
      </h1>
    </div>
    <div style="padding: 20px; text-align: justify">
      <h2 style="font-size: 22px; color: #333333">
        <span style="color: #1a7eb9">Hola, </span> ${this.obtenerNombreEmail(email)}
      </h2>
      <p style="font-size: 16px; color: #555555">
        Le proporcionamos el código de verificación 🔒 para recuperar su
        contraseña para Moda & Estilo . Por favor, utilícelo en la 
        aplicación correspondiente paraverificar su dirección de correo electrónico: ⬇️
      </p>

      <div
        style="
          background-color: #eff2f4;
          padding: 5px;
          border-radius: 8px;
          margin-top: 10px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #333333;
        "
      >
        <p>${code}</p>
      </div>
    </div>
    <div
      style="
        text-align: center;
        padding: 20px;
        background-color: #27567d;
        border-top: 2px solid #f0f0f0;
      "
    >
      <p style="font-size: 14px; color: #fff; margin: 10px 0">
        Nunca pares de aprender,<br />
        Team JhedGost.
      </p>
      <img
        src="https://jhedgost.com/logo.png"
        alt="jhedgost Logo"
        style="
          margin-top: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        "
      />
      <p style="font-size: 14px; color: #fff; margin: 10px 0">
        Enviado por JHEDGOST Av. Manuel Olguin Nro. 325, Abancay, Perú 2025
      </p>
    </div>
  </div>
</div>
`,
          }
      )
      return {msg:"Se envio correctamente el codigo de verificación a tu correo", success: true}
    }catch(e){
     return {msg:"Error no se pudo encontrar tu correo verifique este bien escrito", success: false}
    }
      
  }

    obtenerNombreEmail(email: string){
        var name = '';
        for(var i= 0;i< email.length;i++){
            if(email[i] === '@'){
                break;
            }
            name += email[i];
        }

        return name;
    }
}
