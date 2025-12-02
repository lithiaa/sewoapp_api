import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMitraRatingDto } from './dto/create-mitra-rating.dto';
import { UpdateMitraRatingDto } from './dto/update-mitra-rating.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { MitraRatingEntity } from './entities/mitra-rating.entity';

@Injectable()
export class MitraRatingService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateMitraRatingDto, userId: number) {
    const existingRating = await this.prisma.mitraRating.findFirst({
      where: {
        mitra_id: dto.mitra_id,
        customer_id: userId,
      },
    });

    if (existingRating) {
      throw new ForbiddenException('You have already rated this mitra');
    }

    const existingMitra = await this.prisma.mitraProfile.findFirst({
      where: {
        id: dto.mitra_id,
      },
    });

    if (!existingMitra) {
      throw new NotFoundException('Mitra not found');
    }

    const result = await this.prisma.mitraRating.create({
      data: {
        ...dto,
        customer_id: userId,
      },
    });

    return new MitraRatingEntity(result);
  }

  async findByMitraId(mitraId: number) {
    const existingMitra = await this.prisma.mitraProfile.findFirst({
      where: {
        id: mitraId,
      },
    });

    if (!existingMitra) {
      throw new NotFoundException('Mitra not found');
    }

    const ratings = await this.prisma.mitraRating.findMany({
      where: {
        mitra_id: mitraId,
      },
      select: {
        id: true,
        rating: true,
        review: true,
        customer: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
    });

    return ratings.map((rating) => new MitraRatingEntity(rating));
  }

  async update(ratingId: number, dto: UpdateMitraRatingDto, userId: number) {
    const existingRating = await this.prisma.mitraRating.findUnique({
      where: {
        id: ratingId,
      },
    });

    if (!existingRating) {
      throw new NotFoundException('Rating not found');
    }

    if (existingRating.customer_id !== userId) {
      throw new ForbiddenException('You are not allowed to update this rating');
    }

    const result = await this.prisma.mitraRating.update({
      where: {
        id: ratingId,
      },
      data: {
        ...dto,
      },
    });
    return new MitraRatingEntity(result);
  }

  async remove(ratingId: number, userId: number) {
    const existingRating = await this.prisma.mitraRating.findUnique({
      where: {
        id: ratingId,
      },
    });

    if (!existingRating) {
      throw new NotFoundException('Rating not found');
    }

    if (existingRating.customer_id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this rating');
    }

    const result = await this.prisma.mitraRating.delete({
      where: {
        id: ratingId,
      },
    });
    return new MitraRatingEntity(result);
  }
}
