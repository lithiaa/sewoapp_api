import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';

@Controller('category')
@ApiTags('category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    const data = await this.categoryService.create(dto);

    return {
      data,
      message: 'Category created successfully',
    };
  }

  @Get()
  async findAll() {
    const data = await this.categoryService.findAll();
    return {
      data,
      message: 'Categories retrieved successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.categoryService.findOne(+id);
    return {
      data,
      message: 'Category retrieved successfully',
    };
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const data = await this.categoryService.update(+id, dto);
    return {
      data,
      message: 'Category updated successfully',
    };
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.categoryService.remove(+id);
    return {
      data,
      message: 'Category removed successfully',
    };
  }
}
