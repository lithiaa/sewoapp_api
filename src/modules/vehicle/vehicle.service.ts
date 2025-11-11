import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';

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
      ? await this.cloudinary.uploadFile(imageFile, `vehicles`)
      : null;

    const result = await this.prisma.vehicle.create({
      data: {
        ...dto,
        partner_id: userId,
        image_url: imageUrl ? imageUrl.secure_url : null,
      },
    });

    return result;
  }

  async findAll() {
    const result = await this.prisma.vehicle.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        vehicle_name: true,
        price: true,
        vehicle_year: true,
        license_plate: true,
        description: true,
        status: true,
        image_url: true,
        partner: {
          select: {
            id: true,
            fullname: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return result;
  }

  async findOne(id: number) {
    const result = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        partner: {
          select: {
            id: true,
            fullname: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return result;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    const result = await this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
    });

    return result;
  }

  async remove(id: number) {
    const result = await this.prisma.vehicle.delete({
      where: { id },
    });

    return result;
  }
}
