import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
    const result = await this.prisma.category.create({
      data: {
        ...dto,
      },
    });
    return new CategoryEntity(result);
  }

  async findAll(): Promise<CategoryEntity[]> {
    const result = await this.prisma.category.findMany();
    return result.map((item) => new CategoryEntity(item));
  }

  async findOne(id: number): Promise<CategoryEntity | null> {
    const result = await this.prisma.category.findUnique({
      where: { id },
    });
    return result ? new CategoryEntity(result) : null;
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
  ): Promise<CategoryEntity | null> {
    const result = await this.prisma.category.update({
      where: { id },
      data: {
        ...dto,
      },
    });
    return result ? new CategoryEntity(result) : null;
  }

  async remove(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
