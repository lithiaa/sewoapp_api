import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMitraProfileDto } from './dto/create-mitra-profile.dto';
import { UpdateMitraProfileDto } from './dto/update-mitra-profile.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';
import { haversineDistance } from 'src/utils/haversine.utils';
import { GetDetailMitraProfileEntity } from './entities/get-detail-mitra-profile.entity';
import { GetAllMitraProfileEntity } from './entities/get-mitra-profile.entity';
import { GetNearestMitraEntity } from './entities/get-nearest-mitra.entity';

@Injectable()
export class MitraProfilesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}
  async create(
    dto: CreateMitraProfileDto,
    userId: number,
    imageFile?: Express.Multer.File,
  ) {
    const existing = await this.prisma.mitraProfile.findFirst({
      where: { user_id: userId },
    });

    // TODO: check if user not upload verification documents (mitra)

    if (existing) {
      throw new ForbiddenException('You already have a mitra profile');
    }

    const imageUrl = imageFile
      ? await this.cloudinary.uploadFile(imageFile, `vehicles`)
      : null;

    const result = await this.prisma.mitraProfile.create({
      data: {
        ...dto,
        mitra_image: imageUrl ? imageUrl.secure_url : null,
        user_id: userId,
      },
    });

    return new GetDetailMitraProfileEntity(result);
  }

  async findAll() {
    const result = await this.prisma.mitraProfile.findMany({
      select: {
        id: true,
        mitra_name: true,
        mitra_address: true,
        mitra_image: true,
        operating_hours: true,
        mitra_description: true,
      },
    });

    return result.map((item) => new GetAllMitraProfileEntity(item));
  }

  async findById(id: number) {
    const result = await this.prisma.mitraProfile.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Mitra profile not found');
    }

    return new GetDetailMitraProfileEntity(result);
  }

  async findByUserId(userId: number) {
    const result = await this.prisma.mitraProfile.findFirst({
      where: { user_id: userId },
    });

    if (!result) {
      throw new NotFoundException('Mitra profile not found');
    }

    return new GetDetailMitraProfileEntity(result);
  }

  async findNearest(latitude: number, longitude: number) {
    const mitras = await this.prisma.mitraProfile.findMany({
      select: {
        id: true,
        mitra_image: true,
        mitra_name: true,
        mitra_address: true,
        operating_hours: true,
        mitra_description: true,
        longitude: true,
        latitude: true,
      },
    });

    const result = mitras
      .map((mitra) => {
        const mitraLat = Number(mitra.latitude);
        const mitraLon = Number(mitra.longitude);

        const distance = haversineDistance(
          latitude,
          longitude,
          mitraLat,
          mitraLon,
        );

        return {
          ...mitra,
          latitude: mitraLat,
          longitude: mitraLon,
          distance_km: Number(distance.toFixed(2)),
        };
      })
      .sort((a, b) => a.distance_km - b.distance_km);

    return result.map((item) => new GetNearestMitraEntity(item));
  }

  async update(dto: UpdateMitraProfileDto, userId: number) {
    const existingProfile = await this.prisma.mitraProfile.findFirst({
      where: { user_id: userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Mitra profile not found');
    }

    if (existingProfile.user_id !== userId) {
      throw new ForbiddenException(
        'You dont have permission to update this mitra profile',
      );
    }

    // TODO: handle image update with cloudinary
    const result = await this.prisma.mitraProfile.update({
      where: { id: existingProfile.id },
      data: {
        ...dto,
      },
    });

    return new GetDetailMitraProfileEntity(result);
  }

  async delete(id: number, userId: number) {
    const result = await this.prisma.mitraProfile.delete({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Mitra profile not found');
    }

    if (result.user_id !== userId) {
      throw new ForbiddenException(
        'You dont have permission to delete this mitra profile',
      );
    }

    return new GetDetailMitraProfileEntity(result);
  }
}
