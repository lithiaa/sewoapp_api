import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    example: 'Car',
    description: 'The name of the category',
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Description of the category',
    description: 'A brief description of the category',
    required: false,
  })
  @IsOptional()
  description?: string;
}
