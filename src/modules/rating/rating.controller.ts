import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { RatingEntity } from './entities/rating.entity';
import type { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import { RatingWithCustomerEntity } from './entities/rating-with-customer.entity';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('rating')
@ApiTags('rating')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Roles(Role.CUSTOMER)
  @ApiCreatedResponse({
    description: 'Rating created successfully',
    type: RatingEntity,
  })
  @Post()
  async create(@Body() dto: CreateRatingDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.ratingService.create(dto, userId);

    return {
      data,
      message: 'Rating created successfully',
    };
  }

  @Get(':vehicleId')
  @Public()
  @ApiOkResponse({
    description: 'Ratings retrieved successfully',
    type: [RatingWithCustomerEntity],
  })
  async findByVehicle(@Param('vehicleId') vehicleId: number) {
    const data = await this.ratingService.findByVehicle(vehicleId);

    return {
      data,
      message: 'Ratings retrieved successfully',
    };
  }

  @Roles(Role.CUSTOMER)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Rating updated successfully',
    type: RatingEntity,
  })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateRatingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const data = await this.ratingService.update(+id, dto, userId);

    return {
      data,
      message: 'Rating updated successfully',
    };
  }

  @Delete(':id')
  @Roles(Role.CUSTOMER)
  @ApiOkResponse({
    description: 'Rating deleted successfully',
    type: RatingEntity,
  })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.ratingService.remove(+id, userId);

    return {
      data,
      message: 'Rating deleted successfully',
    };
  }
}
