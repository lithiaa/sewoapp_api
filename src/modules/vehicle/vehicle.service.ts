import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';
import { GetVehiclesFilterDto } from './dto/get-vehicle-filter.dto';
import { Prisma } from 'generated/prisma';
import {
  VehicleOutput,
  VehicleWithConditionalFavorites,
} from './types/vehicle.type';

@Injectable()
export class VehicleService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}
  async create(
    dto: CreateVehicleDto,
    userId: number,
    imageFile?: Express.Multer.File,
  ) {
    const imageUrl = imageFile
      ? await this.cloudinary.uploadFile(imageFile, `mitra-profiles`)
      : null;

    const mitraProfile = await this.prisma.mitraProfile.findFirst({
      where: { user_id: userId },
    });

    if (!mitraProfile) {
      throw new NotFoundException('You do not have a mitra profile');
    }

    const result = await this.prisma.vehicle.create({
      data: {
        ...dto,
        mitra_id: mitraProfile.id,
        image_url: imageUrl ? imageUrl.secure_url : null,
      },
    });

    return result;
  }

  async findAll(
    query: GetVehiclesFilterDto,
    userId?: number,
  ): Promise<VehicleOutput[]> {
    const where = this.buildWhereClause(query);

    const baseSelect = {
      id: true,
      vehicle_name: true,
      price: true,
      vehicle_year: true,
      license_plate: true,
      description: true,
      status: true,
      image_url: true,
      transmission: true,
      specification: true,
      features: true,
      capacity: true,
      created_at: true,
      updated_at: true,
      mitra: {
        select: {
          id: true,
          mitra_name: true,
          mitra_address: true,
          mitra_description: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    };

    const select = {
      ...baseSelect,
      ...(userId && {
        favorites: {
          where: {
            customer_id: userId,
          },
          select: {
            id: true,
          },
        },
      }),
    };

    const result = await this.prisma.vehicle.findMany({
      where,
      orderBy: { created_at: 'desc' },
      select: select,
    });

    return result.map((vehicle) => {
      const data = vehicle as VehicleWithConditionalFavorites;

      const isFavorited =
        (userId && data.favorites && data.favorites.length > 0) ?? false;

      const { favorites, ...vehicleWithoutFavorites } = data;

      return {
        ...vehicleWithoutFavorites,
        is_favorited: isFavorited,
      } as VehicleOutput;
    });
  }

  async findOne(id: number, userId?: number): Promise<VehicleOutput | null> {
    const result = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        mitra: {
          select: {
            id: true,
            mitra_name: true,
            mitra_address: true,
            mitra_description: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        favorites: userId
          ? {
              where: {
                customer_id: userId,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
    });

    if (!result) return null;

    const isFavorited =
      userId && Array.isArray(result.favorites) && result.favorites.length > 0
        ? true
        : false;

    const { favorites, ...vehicleWithoutFavorites } =
      result as VehicleWithConditionalFavorites;

    return {
      ...vehicleWithoutFavorites,
      is_favorited: isFavorited,
    };
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    // TODO: implement update logic with image handling (cloudinary)
    const result = await this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
    });

    if (!result) {
      throw new NotFoundException('Vehicle not found');
    }

    return result;
  }

  async remove(id: number) {
    const result = await this.prisma.vehicle.delete({
      where: { id },
    });

    return result;
  }

  private buildWhereClause(
    query: GetVehiclesFilterDto,
  ): Prisma.VehicleWhereInput {
    const { category, transmission, capacity, minPrice, maxPrice } = query;

    const where: Prisma.VehicleWhereInput = {};

    if (category) {
      where.category = { name: category };
    }

    if (transmission) {
      where.transmission = transmission;
    }

    if (capacity) {
      where.capacity = this.mapCapacityToRange(capacity);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    return where;
  }

  private mapCapacityToRange(
    capacity: 'small' | 'medium' | 'large',
  ): Prisma.IntFilter {
    switch (capacity) {
      case 'small':
        return { lt: 4 };
      case 'medium':
        return { gte: 4, lte: 6 };
      case 'large':
        return { gt: 6 };
      default:
        return {};
    }
  }
}
