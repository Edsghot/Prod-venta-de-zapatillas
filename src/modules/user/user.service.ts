import { Injectable } from '@nestjs/common';
import {CreateUserRequest} from './request/CreateUserRequest.request'
import {UpdateUserRequest} from './request/UpdateUserRequest.request'
import { InjectRepository } from '@nestjs/typeorm';
import { ValidateService } from 'src/Common/Validate/validate.service';
import { Repository } from 'typeorm';
import { User } from './entity/UserEntity.entity';
import * as moment from 'moment-timezone';
import { DateRangeDto } from './request/DateRangeDto.dto';
import { ValidateEmailDto } from './request/validateEmail.dto';
import { ValidateEmailSmsEntity } from '../auth-validate/entity/ValidateEmailSms.entity';
import { RecoverPasswordDto } from './request/recoverPassword.dto';
import {Not} from 'typeorm';
import { Review } from '../product/entity/ReviewEntity.entity';
import { CreateProductRequest } from '../product/request/CreateProductRequest.request';
import { CreateReviewRequest } from '../product/request/CreateReview.request';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private validateService: ValidateService,
        @InjectRepository(ValidateEmailSmsEntity)
        private validateRepository: Repository<ValidateEmailSmsEntity>,
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
      ) {
      }
    
      async createreview(request: CreateReviewRequest) {
        try {
            var entity = new Review();

            entity.IdProduct = request.IdProduct;
            entity.IdClient = request.IdClient;
            var client = await this.userRepository.findOne({where:{IdUser:request.IdClient}});
            if(client == null){
              return { msg: 'No se encontro al cliente', success: false };
            }
            entity.NameClient = client.FirstName + ' ' + client.LastName;
            entity.starts = request.starts;
            entity.Comment = request.Comment;
            entity.Date = moment.tz('America/Lima').toDate();
            const newReview = this.reviewRepository.create(request);

            await this.reviewRepository.save(newReview);
            return { msg: 'Comentario insertado con exito!', success: true };
        } catch (error) {
            return { msg: 'Error al insertar comentario', detailMsg: error.message, success: false };
        }
    }

    async getAllByProduct(idProduct: number) {
      try {
          var review = await this.reviewRepository.find({where:{IdProduct:idProduct}});

          return { msg: 'data',data: review, success: true };
      } catch (error) {
          return { msg: 'error al obtener la data', detailMsg: error.message, success: false };
      }
      
    }
     async  getReviewByid(idReview: number){
      try {
        var review = await this.reviewRepository.findOne({where:{IdReview:idReview}});

            return { msg: 'data',data: review, success: true };
        } catch (error) {
            return { msg: 'error al obtener la data', detailMsg: error.message, success: false };
        }
     }
  /*async insertUser(request: CreateUserRequest) {
    try {
      let band: { success: boolean, msg: string };
      band = await this.validateService.validateDni(request.Dni);
      
      if (!band.success) {
        return { msg: band.msg, success: band.success, data: null };
      }
  
      band = await this.validateService.validatePhoneNumber(request.Phone);
      
      if (!band.success) {
        return { msg: band.msg, success: band.success, data: null };
      }
  
      band = await this.validateService.validateFirstName(request.FirstName);
      
      if (!band.success) {
        return { msg: band.msg, success: band.success, data: null };
      }
  
      band = await this.validateService.validateLastName(request.LastName);
  
      if (!band.success) {
        return { msg: band.msg, success: band.success, data: null };
      }
  
      const userDni = await this.userRepository.findOne({ where: { Dni: request.Dni,Deleted:false } });
  
      if (userDni) {
        return { msg: "Ya se registró un usuario con ese DNI", success: false, data: null };
      }

      const userMail = await this.userRepository.findOne({ where: { Mail: request.Mail,Deleted:false } });
  
      if (userMail) {
        return { msg: "Ya se registró un usuario con ese EMAIL", success: false, data: null };
      }
  
      const newUser = this.userRepository.create({
        FirstName: request.FirstName,
        LastName: request.LastName,
        Password: request.Password,
        BirthDate: request.BirthDate,
        Phone: request.Phone,
        Dni: request.Dni,
        Mail: request.Mail,
        Rol: request.Rol,
        Address: request.Address,
        DateCreated:moment.tz('America/Lima').toDate(),
        Deleted:false
      });
  
      // Guardar la nueva entidad de usuario en la base de datos
      await this.userRepository.save(newUser);
  
      return { msg: 'Usuario insertado correctamente', success: true}

    }catch(e){
        return {msg: "Error al insertar usuario",success: false,smsDetail: e.msg}
    }
}
      
  async updateUser(updateUserDto: UpdateUserRequest) {
    try {
      const user = await this.userRepository.findOne({
        where: { IdUser: updateUserDto.IdUser },
      });
      if (!user) {
        return { msg: 'Usuario no encontrado', success: false };
      }
  
      user.FirstName = updateUserDto.FirstName;
      user.LastName = updateUserDto.LastName;
      user.Password = updateUserDto.Password;
      user.Phone = updateUserDto.Phone;
      user.BirthDate = updateUserDto.BirthDate;
      user.Dni = updateUserDto.Dni;
      user.Address = updateUserDto.Address;
      user.Mail = updateUserDto.Mail;
      user.Rol = updateUserDto.Rol;
  
      await this.userRepository.save(user);
  
      return { msg: 'Usuario actualizado exitosamente', success: true };
    } catch (error) {
      return { msg: 'Error al actualizar usuario', detailMsg: error, success: false };
    }
  }
  
  async getAllUsers() {
    try {
      const users = await this.userRepository.find({
        where:{Deleted:false}});
      return { data: users, msg: 'Éxito', success: true };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { msg: 'Error al obtener usuarios', detailMsg: error, success: false };
    }
  }
  
  async deleteUser(userId: number) {
    try {
      var user=await this.userRepository.findOne({
        where:{IdUser:userId}
      })
      if(!user){
        return { msg: 'No se encontro usuario', success: false, data: null };
      }
      user.Deleted=true;
      await this.userRepository.save(user);
      return { msg: 'Usuario eliminado exitosamente', success: true };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return { msg: 'Error al eliminar usuario', detailMsg: error, success: false };
    }
  }
  
  async getUserById(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { IdUser: userId,Deleted:false },
      });
      return { data: user, msg: 'Éxito', success: true };
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return { msg: 'Error al obtener usuario', detailMsg: error, success: false };
    }
  }
  
  async login(userRequest: string, password: string) {
    try {
      let userRes;
      userRes = await this.userRepository.findOne({
        where: { Mail: userRequest, Password: password,Deleted:false},
      });

      
  
      if (!userRes) {
        userRes = await this.userRepository.findOne({
          where: { Dni: userRequest, Password: password, Deleted:false},
        });
  
        if (!userRes) {
          return {
            data: null,
            msg: 'Usuario o contraseña incorrectos',
            success: false,
          };
        }
      }
  
      return { data: userRes, msg: 'Éxito', success: true };
    } catch (error) {
      return { msg: 'Error al iniciar sesión', detailMsg: error, success: false };
    }
  }
  
  async getUserByDateRange(request:DateRangeDto){
    try{
      const data = await this.userRepository.query(
          `CALL getUserByDateRange('${request.StartDate}', '${request.EndDate}')`,
        );
        if (data && data.length > 0 && data[0].length > 0) {
          return {
            msg: 'Lista de usuarios completa',
            data: data[0],
            success: true,
          };
        } else {
          return {
            msg: 'La lista de usuarios está vacía',
            data: [],
            success: false,
          };
        }
  }catch(error){
      console.error('Error al recuperar todos los usuarios:', error);
      return {
          msg: 'Error al recuperar todos los usuarios',
          detailMsg: error.message,
          success: false,
    };
  }
  }
  
  async validateCode(data: ValidateEmailDto) {
    const { Email, Code } = data;

    var existing = await this.validateRepository.findOne({
      where: { Email },
    });

    if (existing === null) {
      return { msg: 'Error en validar el codigo', value: false };
    }

    if (existing.Code === Code) {
      return { msg: 'Esta correcto', value: true };
    }

    return { msg: 'Error al validar código', value: false };
  }
  async recoverPassword(update: RecoverPasswordDto) {
    var user = await this.userRepository.findOne({
      where: { Mail: update.Email,Deleted:false },
    });

    if (user === null) {
      return {
        msg: 'No se encontro el usuario',
        value: false,
      };
    }

    if (!update.Password) {
      return {
        msg: 'Su nueva contraseña no tiene caracteres',
        value: false,
      };
    }

    try {
      
      user.Password = update.Password;

      await this.userRepository.save(user);

      return {
        msg: 'se actualizo correctamente',
        success: true,
      };
    } catch (e) {
      return {
        msg: 'Error al recuperar la contraseña',
        success: false,
      };
    }
  }
}*/
async insertUser(request: CreateUserRequest) {
  try {
    let band: { success: boolean, msg: string };
    band = await this.validateService.validateDni(request.Dni);

    if (!band.success) {
      return { msg: band.msg, success: band.success, data: null };
    }

    band = await this.validateService.validatePhoneNumber(request.Phone);

    if (!band.success) {
      return { msg: band.msg, success: band.success, data: null };
    }

    band = await this.validateService.validateFirstName(request.FirstName);

    if (!band.success) {
      return { msg: band.msg, success: band.success, data: null };
    }

    band = await this.validateService.validateLastName(request.LastName);

    if (!band.success) {
      return { msg: band.msg, success: band.success, data: null };
    }

    // Validar extensión del correo
    const isGmail = this.validateGmail(request.Mail);
    if (!isGmail) {
      return { msg: "El correo debe ser una dirección válida de @gmail.com", success: false, data: null };
    }

    // Validar mayoría de edad
    const isAdult = this.validateAge(request.BirthDate);
    if (!isAdult) {
      return { msg: "El usuario debe tener al menos 18 años de edad", success: false, data: null };
    }

    const userDni = await this.userRepository.findOne({ where: { Dni: request.Dni, Deleted: false } });

    if (userDni) {
      return { msg: "Ya se registró un usuario con ese DNI", success: false, data: null };
    }

    const userMail = await this.userRepository.findOne({ where: { Mail: request.Mail, Deleted: false } });

    if (userMail) {
      return { msg: "Ya se registró un usuario con ese EMAIL", success: false, data: null };
    }

    const newUser = this.userRepository.create({
      FirstName: request.FirstName,
      LastName: request.LastName,
      Password: request.Password,
      BirthDate: request.BirthDate,
      Phone: request.Phone,
      Dni: request.Dni,
      Mail: request.Mail,
      Rol: request.Rol,
      Address: request.Address,
      DateCreated: moment.tz('America/Lima').toDate(),
      Deleted: false,
    });

    await this.userRepository.save(newUser);

    return { msg: 'Usuario insertado correctamente', success: true };

  } catch (e) {
    return { msg: "Error al insertar usuario", success: false, smsDetail: e.msg };
  }
}
async updateUser(updateUserDto: UpdateUserRequest) {
  try {
    const user = await this.userRepository.findOne({
      where: { IdUser: updateUserDto.IdUser },
    });

    if (!user) {
      return { msg: 'Usuario no encontrado', success: false };
    }

    // Validar que el DNI tenga exactamente 8 dígitos
    if (!/^\d{8}$/.test(updateUserDto.Dni)) {
      return { msg: 'El DNI debe tener exactamente 8 dígitos', success: false };
    }
    // Validar que el número de teléfono tenga exactamente 9 dígitos y comience con 9
  if (!/^9\d{8}$/.test(updateUserDto.Phone)) {
    return { msg: 'El número de teléfono debe tener exactamente 9 dígitos y comenzar con 9', success: false };
  }

    // Validar extensión del correo
    const isGmail = this.validateGmail(updateUserDto.Mail);
    if (!isGmail) {
      return { msg: "El correo debe ser una dirección válida de @gmail.com", success: false };
    }

    // Validar mayoría de edad
    const isAdult = this.validateAge(updateUserDto.BirthDate);
    if (!isAdult) {
      return { msg: "El usuario debe tener al menos 18 años de edad", success: false };
    }

    // Validar si el DNI ya está registrado por otro usuario
    const existingUserWithDni = await this.userRepository.findOne({
      where: { Dni: updateUserDto.Dni, IdUser: Not(updateUserDto.IdUser), Deleted: false },
    });
    if (existingUserWithDni) {
      return { msg: 'Ya se registró un usuario con ese DNI', success: false };
    }

    // Validar si el correo electrónico ya está registrado por otro usuario
    const existingUserWithMail = await this.userRepository.findOne({
      where: { Mail: updateUserDto.Mail, IdUser: Not(updateUserDto.IdUser), Deleted: false },
    });
    if (existingUserWithMail) {
      return { msg: 'Ya se registró un usuario con ese EMAIL', success: false };
    }

    // Validar que nombre y apellido no estén vacíos
  if (!updateUserDto.FirstName || updateUserDto.FirstName.trim() === '') {
    return { msg: 'El nombre no puede estar vacío', success: false };
  }

  if (!updateUserDto.LastName || updateUserDto.LastName.trim() === '') {
    return { msg: 'El apellido no puede estar vacío', success: false };
  }

    user.FirstName = updateUserDto.FirstName;
    user.LastName = updateUserDto.LastName;
    user.Password = updateUserDto.Password;
    user.Phone = updateUserDto.Phone;
    user.BirthDate = updateUserDto.BirthDate;
    user.Dni = updateUserDto.Dni;
    user.Address = updateUserDto.Address;
    user.Mail = updateUserDto.Mail;
    user.Rol = updateUserDto.Rol;

    await this.userRepository.save(user);

    return { msg: 'Usuario actualizado exitosamente', success: true };
  } catch (error) {
    return { msg: 'Error al actualizar usuario', detailMsg: error, success: false };
  }
}

// Método para validar correos de @gmail.com
private validateGmail(email: string): boolean {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(email);
}

// Método para validar mayoría de edad
private validateAge(birthDate: Date): boolean {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
}


async getAllUsers() {
  try {
    const users = await this.userRepository.find({
      where:{Deleted:false}});
    return { data: users, msg: 'Éxito', success: true };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return { msg: 'Error al obtener usuarios', detailMsg: error, success: false };
  }
}

async deleteUser(userId: number) {
  try {
    var user=await this.userRepository.findOne({
      where:{IdUser:userId}
    })
    if(!user){
      return { msg: 'No se encontro usuario', success: false, data: null };
    }
    user.Deleted=true;
    await this.userRepository.save(user);
    return { msg: 'Usuario eliminado exitosamente', success: true };
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return { msg: 'Error al eliminar usuario', detailMsg: error, success: false };
  }
}

async getUserById(userId: number) {
  try {
    const user = await this.userRepository.findOne({
      where: { IdUser: userId,Deleted:false },
    });
    return { data: user, msg: 'Éxito', success: true };
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    return { msg: 'Error al obtener usuario', detailMsg: error, success: false };
  }
}

async login(userRequest: string, password: string) {
  try {
    let userRes;
    userRes = await this.userRepository.findOne({
      where: { Mail: userRequest, Password: password,Deleted:false},
    });

    

    if (!userRes) {
      userRes = await this.userRepository.findOne({
        where: { Dni: userRequest, Password: password, Deleted:false},
      });

      if (!userRes) {
        return {
          data: null,
          msg: 'Usuario o contraseña incorrectos',
          success: false,
        };
      }
    }

    return { data: userRes, msg: 'Éxito', success: true };
  } catch (error) {
    return { msg: 'Error al iniciar sesión', detailMsg: error, success: false };
  }
}

async getUserByDateRange(request:DateRangeDto){
  try{
    const data = await this.userRepository.query(
        `CALL getUserByDateRange('${request.StartDate}', '${request.EndDate}')`,
      );
      if (data && data.length > 0 && data[0].length > 0) {
        return {
          msg: 'Lista de usuarios completa',
          data: data[0],
          success: true,
        };
      } else {
        return {
          msg: 'La lista de usuarios está vacía',
          data: [],
          success: false,
        };
      }
}catch(error){
    console.error('Error al recuperar todos los usuarios:', error);
    return {
        msg: 'Error al recuperar todos los usuarios',
        detailMsg: error.message,
        success: false,
  };
}
}

async validateCode(data: ValidateEmailDto) {
  const { Email, Code } = data;

  var existing = await this.validateRepository.findOne({
    where: { Email },
  });

  if (existing === null) {
    return { msg: 'Error en validar el codigo', value: false };
  }

  if (existing.Code === Code) {
    return { msg: 'Esta correcto', value: true };
  }

  return { msg: 'Error al validar código', value: false };
}
async recoverPassword(update: RecoverPasswordDto) {
  var user = await this.userRepository.findOne({
    where: { Mail: update.Email,Deleted:false },
  });

  if (user === null) {
    return {
      msg: 'No se encontro el usuario',
      value: false,
    };
  }

  if (!update.Password) {
    return {
      msg: 'Su nueva contraseña no tiene caracteres',
      value: false,
    };
  }

  try {
    
    user.Password = update.Password;

    await this.userRepository.save(user);

    return {
      msg: 'se actualizo correctamente',
      success: true,
    };
  } catch (e) {
    return {
      msg: 'Error al recuperar la contraseña',
      success: false,
    };
  }
}
}