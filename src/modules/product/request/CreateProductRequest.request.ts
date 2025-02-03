import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsPositive, IsOptional } from "class-validator";


export class CreateProductRequest {
    @IsNotEmpty()
    @IsString()
    Name: string;
  
    @IsNotEmpty()
    @IsString()
    Description: string;
  
    @IsNotEmpty()
    @IsString()
    NutritionalInformation: string;

    UrlImage: string;
  
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsPositive({ message: 'El precio debe ser un número positivo.' })
    Price: number;

    @IsNotEmpty()
    @IsString()
    Talla: string; // New field for size

    @IsNotEmpty()
    @IsString()
    Marca: string; // New field for brand

    @IsNotEmpty()
    @IsString()
    Color: string;

    @IsNotEmpty()
    @IsString()
    Genero: string;

    Category: string;

    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsPositive({ message: 'El stock debe ser un número positivo.' })
    Stock: number;

    

    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsPositive({ message: 'El sku debe ser un número positivo.' })
    Sku: number;

    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsPositive({ message: 'El discount debe ser un número positivo.' })
    Discount: number;
}
