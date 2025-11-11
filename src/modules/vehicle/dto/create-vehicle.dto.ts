import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { VehicleStatus } from 'generated/prisma';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'Category Vehicle',
    description: 'The category ID of the vehicle',
  })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsNumber({}, { message: 'Category ID must be a number' })
  @Type(() => Number)
  category_id: number;

  @ApiProperty({
    example: 'Toyota',
    description: 'The name of the vehicle',
  })
  @IsString({ message: 'Vehicle name must be a string' })
  @IsNotEmpty({ message: 'Vehicle name is required' })
  @MaxLength(100, { message: 'Vehicle name is too long' })
  vehicle_name: string;

  @ApiProperty({
    example: '180000',
    description: 'The price of the vehicle per day in IDR',
  })
  @IsNotEmpty({ message: 'Price per day is required' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number' })
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: '2004',
    description: 'The vehicle year of manufacture',
  })
  @IsNotEmpty({ message: 'Year of manufacture is required' })
  @IsNumber({}, { message: 'Year of manufacture must be a number' })
  @Type(() => Number)
  vehicle_year: number;

  @ApiProperty({
    example: 'AB6006EV',
    description: 'The vehicle license plate number',
  })
  @IsString({ message: 'License plate must be a string' })
  @IsNotEmpty({ message: 'License plate is required' })
  @MaxLength(20, { message: 'License plate is too long' })
  license_plate: string;

  @ApiProperty({
    example: 'Description of the vehicle',
    description: 'A brief description of the vehicle',
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Description is too long' })
  description: string;

  @ApiProperty({
    example: 'AVAILABLE',
    enum: VehicleStatus,
    description: 'The current status of the vehicle',
  })
  @IsEnum(VehicleStatus, {
    message: 'Vehicle status must available, rented, or maintenance',
  })
  @IsNotEmpty({ message: 'Vehicle status is required' })
  status: VehicleStatus;

  @IsOptional()
  image_url?: string;
}
