import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MitraRatingService } from './mitra-rating.service';
import { CreateMitraRatingDto } from './dto/create-mitra-rating.dto';
import { UpdateMitraRatingDto } from './dto/update-mitra-rating.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { Public } from 'src/common/decorators/public.decorator';
import { MitraRatingEntity } from './entities/mitra-rating.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetAllMitraRatingEntity } from './entities/get-all-mitra-rating.entity';

@Controller('mitra-rating')
@ApiTags('Rating for Mitra')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class MitraRatingController {
  constructor(private readonly mitraRatingService: MitraRatingService) {}

  @Roles(Role.CUSTOMER)
  @Post()
  @ApiCreatedResponse({
    description: 'Create rating for mitra',
    type: MitraRatingEntity,
  })
  async create(
    @Body() dto: CreateMitraRatingDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const data = await this.mitraRatingService.create(dto, userId);

    return {
      data,
      message: 'Mitra rating created successfully',
    };
  }

  @Public()
  @Get('mitra/:mitraId')
  @ApiOkResponse({
    description: 'Get ratings by mitra',
    type: [GetAllMitraRatingEntity],
  })
  async getRatingByMitra(@Param('mitraId') mitraId: number) {
    const data = await this.mitraRatingService.findByMitraId(mitraId);
    return {
      data,
      message: 'Mitra ratings retrieved successfully',
    };
  }

  @Roles(Role.CUSTOMER)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Update mitra rating',
    type: MitraRatingEntity,
  })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateMitraRatingDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const data = await this.mitraRatingService.update(+id, dto, userId);

    return {
      data,
      message: 'Mitra rating updated successfully',
    };
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete mitra rating',
  })
  async delete(@Param('id') id: number, @Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.mitraRatingService.remove(+id, userId);

    return {
      data,
      message: 'Mitra rating deleted successfully',
    };
  }
}
