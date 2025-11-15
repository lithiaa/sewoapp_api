import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { FavoriteEntity } from './entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}
  async toggle(dto: CreateFavoriteDto, userId: number) {
    // check if users exist
    const existing = await this.prisma.favorite.findUnique({
      where: {
        customer_id_vehicle_id: {
          customer_id: userId,
          vehicle_id: dto.vehicle_id,
        },
      },
    });

    // if users exist, remove favorite
    if (existing) {
      await this.prisma.favorite.delete({
        where: {
          customer_id_vehicle_id: {
            customer_id: userId,
            vehicle_id: dto.vehicle_id,
          },
        },
      });

      return null;
    }

    // if users not exist, create favorite
    const created = await this.prisma.favorite.create({
      data: {
        customer_id: userId,
        vehicle_id: dto.vehicle_id,
      },
      select: {
        id: true,
        customer_id: true,
        vehicle: {
          select: {
            id: true,
            vehicle_name: true,
            price: true,
            vehicle_year: true,
          },
        },
      },
    });

    return new FavoriteEntity(created);
  }

  async findAll(userId: number): Promise<FavoriteEntity[]> {
    const result = await this.prisma.favorite.findMany({
      where: {
        customer_id: userId,
      },
      select: {
        id: true,
        customer_id: true,
        vehicle: {
          select: {
            id: true,
            vehicle_name: true,
            price: true,
            vehicle_year: true,
          },
        },
      },
    });

    return result.map((item) => {
      return new FavoriteEntity({
        id: item.id,
        customer_id: item.customer_id,
        vehicle_id: item.vehicle.id,
        vehicle_name: item.vehicle.vehicle_name,
        price: item.vehicle.price,
        vehicle_year: item.vehicle.vehicle_year,
      });
    });
  }
}
