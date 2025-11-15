import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FavoriteEntity } from './entities/favorite.entity';
import type { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorite')
@ApiTags('favorite')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Roles(Role.CUSTOMER)
  @Get('users')
  @ApiOkResponse({
    description: 'Get all favorite vehicles for the authenticated user',
    type: FavoriteEntity,
    isArray: true,
  })
  async findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.favoriteService.findAll(userId);

    return {
      data,
      message: 'Favorite vehicles retrieved successfully',
    };
  }

  @Roles(Role.CUSTOMER)
  @Post()
  @ApiCreatedResponse({
    description: 'Toggle favorite status for a vehicle',
    type: FavoriteEntity,
  })
  async toggle(
    @Body() dto: CreateFavoriteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const data = await this.favoriteService.toggle(dto, userId);

    return {
      data,
      message: 'Favorite status toggled successfully',
    };
  }
}
