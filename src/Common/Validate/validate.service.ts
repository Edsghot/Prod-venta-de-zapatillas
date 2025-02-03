import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
@Injectable()
export class ValidateService {
  
    async validateDni(dni: string) {
        // Validar que el DNI tenga exactamente 8 caracteres
        if (dni.length !== 8) {
            return { success: false, msg: "El DNI debe tener exactamente 8 caracteres" };
        }
    
        // Validar que el DNI contenga solo números
        if (!/^\d+$/.test(dni)) {
            return { success: false, msg: "El DNI debe contener solo números" };
        }
    
        // Agregar aquí más validaciones según sea necesario
    
        // Si todas las validaciones pasan, devolver éxito
        return { success: true, msg: "DNI válido" };
    }
    

    async validatePhoneNumber(phone: string) {
    
        // Validar que el número de teléfono contenga solo dígitos numéricos
        if (!/^\d+$/.test(phone)) {
            return { success: false, msg: "El número de teléfono debe contener solo dígitos numéricos" };
        }
    
        // Validar la longitud del número de teléfono
        if (phone.length !== 9) {
            return { success: false, msg: "El número de teléfono debe tener 9 dígitos" };
        }
    
        // Agregar más validaciones según sea necesario, como el formato específico del número de teléfono
    
        // Si todas las validaciones pasan, devolver éxito
        return { success: true, msg: "Número de teléfono válido" };
    }
    

    async validateFirstName(name: string) {
        // Verificar si el nombre está vacío
        if (!name.trim()) {
            return { success: false, msg: "El nombre no puede estar vacío" };
        }
    
        // Verificar si el nombre contiene solo letras y espacios
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return { success: false, msg: "El nombre solo puede contener letras y espacios" };
        }
    
        // Verificar la longitud del nombre (por ejemplo, entre 2 y 50 caracteres)
        if (name.length < 2 || name.length > 50) {
            return { success: false, msg: "El nombre debe tener entre 2 y 50 caracteres" };
        }
    
        // Todas las validaciones pasaron, el nombre es válido
        return { success: true, msg: "Nombre válido" };
    }
    
    async validateLastName(name: string) {
        // Verificar si el apellido está vacío
        if (!name.trim()) {
            return { success: false, msg: "El apellido no puede estar vacío" };
        }
    
        // Verificar si el apellido contiene solo letras y espacios
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return { success: false, msg: "El apellido solo puede contener letras y espacios" };
        }
    
        // Verificar la longitud del apellido (por ejemplo, entre 2 y 50 caracteres)
        if (name.length < 2 || name.length > 50) {
            return { success: false, msg: "El apellido debe tener entre 2 y 50 caracteres" };
        }
    
        // Todas las validaciones pasaron, el apellido es válido
        return { success: true, msg: "Apellido válido" };
    }
}
