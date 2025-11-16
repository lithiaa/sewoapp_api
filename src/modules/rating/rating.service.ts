import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { RatingEntity } from './entities/rating.entity';
import { RatingWithCustomerEntity } from './entities/rating-with-customer.entity';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateRatingDto, userId: number): Promise<RatingEntity> {
    const existingRating = await this.prisma.rating.findFirst({
      where: {
        vehicle_id: dto.vehicle_id,
        customer_id: userId,
      },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this vehicle');
    }

    const existingVehicle = await this.prisma.vehicle.findFirst({
      where: {
        id: dto.vehicle_id,
      },
    });

    if (!existingVehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const result = await this.prisma.rating.create({
      data: {
        ...dto,
        customer_id: userId,
      },
    });

    return new RatingEntity(result);
  }

  async findByVehicle(id: number): Promise<RatingWithCustomerEntity[]> {
    const existing = await this.prisma.vehicle.findFirst({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Vehicle not found');
    }

    const result = this.prisma.rating.findMany({
      where: {
        vehicle_id: id,
      },
      select: {
        id: true,
        vehicle_id: true,
        rating: true,
        review: true,
        created_at: true,
        customer: {
          select: {
            id: true,
            fullname: true,
          },
        },
      },
    });

    return (await result).map((item) => new RatingWithCustomerEntity(item));
  }

  async update(
    id: number,
    dto: UpdateRatingDto,
    userId: number,
  ): Promise<RatingEntity> {
    const existing = await this.prisma.rating.findFirst({
      where: {
        id,
        customer_id: userId,
      },
    });

    if (!existing) {
      throw new NotFoundException('Rating not found or not accessible');
    }

    const result = await this.prisma.rating.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    return new RatingEntity(result);
  }

  remove(id: number, userId: number) {
    const existing = this.prisma.rating.findFirst({
      where: {
        id,
        customer_id: userId,
      },
    });

    if (!existing) {
      throw new NotFoundException('Rating not found');
    }

    return this.prisma.rating.delete({
      where: { id },
    });
  }
}
