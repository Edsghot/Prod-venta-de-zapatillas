import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class UpdateProductRequest {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    IdProduct: number;
  
    @IsOptional()
    @IsString()
    Name?: string;
  
    @IsOptional()
    @IsString()
    Description?: string;
  
    @IsOptional()
    @IsString()
    NutritionalInformation?: string;
  
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsPositive({ message: 'El precio debe ser un número positivo.' })
    Price?: number;

    @IsOptional()
    @IsString()
    Talla?: string; // New field for size, ensure frontend sends correct data type


    @IsOptional()
    @IsString()
    Marca?: string; // New field for brand, ensure frontend sends correct data type


    @IsOptional()
    @IsString()
    Genero?: string;

    @IsOptional()
    @IsString()
    Color?: string;

    UrlImage: string;

    Visible: boolean;

    Category: string;

    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsPositive({ message: 'El stock debe ser un número positivo.' })
    Stock: number;

  


    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsPositive({ message: 'El Sku debe ser un número positivo.' })
    Sku: number;

    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsPositive({ message: 'El Discount debe ser un número positivo.' })
    Discount: number;
}
