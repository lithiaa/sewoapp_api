import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { VehicleEntity } from './entities/vehicle.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetVehiclesFilterDto } from './dto/get-vehicle-filter.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('vehicle')
@ApiTags('vehicle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Roles(Role.PARTNER)
  @Post()
  @ApiCreatedResponse({
    description: 'Vehicle created successfully',
    type: VehicleEntity,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image_url', maxCount: 1 }]))
  async create(
    @Body() dto: CreateVehicleDto,
    @UploadedFiles()
    files: {
      image_url?: Express.Multer.File[];
    },
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const imageFile = files.image_url?.[0];

    const data = await this.vehicleService.create(dto, userId, imageFile);

    return {
      data,
      message: 'Vehicle created successfully',
    };
  }

  @Get()
  @Public()
  @ApiCreatedResponse({
    description: 'Vehicles retrieved successfully',
    type: VehicleEntity,
  })
  async findAll(
    @Query() query: GetVehiclesFilterDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;

    const data = await this.vehicleService.findAll(query, userId);

    return {
      data,
      message: 'Vehicles retrieved successfully',
    };
  }

  @Get(':id')
  @Public()
  @ApiCreatedResponse({
    description: 'Vehicle detail retrieved successfully',
    type: VehicleEntity,
  })
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    const data = await this.vehicleService.findOne(+id, userId);

    return {
      data,
      message: 'Vehicle detail retrieved successfully',
    };
  }

  @Patch(':id')
  @ApiCreatedResponse({
    description: 'Vehicle updated successfully',
    type: VehicleEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.update(+id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Vehicle deleted successfully',
  })
  async remove(@Param('id') id: string) {
    return this.vehicleService.remove(+id);
  }
}
