import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<UserEntity[]> {
    const results = await this.prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        phone_number: true,
        address: true,
        role: true,
        is_verified: true,
        created_at: true,
      },
    });

    return results.map((user) => new UserEntity(user));
  }

  async getUserById(id: number): Promise<UserEntity> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    const result = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        phone_number: true,
        address: true,
        role: true,
        is_verified: true,
        created_at: true,
      },
    });

    if (!result) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(result);
  }
}
