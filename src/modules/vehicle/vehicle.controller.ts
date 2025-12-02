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
  ApiOkResponse,
  ApiQuery,
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
import { NearestVehicleEntity } from './entities/get-nearest-vehicle';
import { GetVehicleCategoryEntity } from './entities/get-vehicle-category';
import { GetVehicleByMitraEntity } from './entities/get-vehicle-by-mitra.entity';

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
  @ApiOkResponse({
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

  @Get('nearest')
  @ApiQuery({ name: 'longitude', required: true })
  @ApiQuery({ name: 'latitude', required: true })
  @ApiOkResponse({
    description: 'Get nearest mitra profiles',
    type: [NearestVehicleEntity],
  })
  async findNearest(
    @Query('longitude') longitude: string,
    @Query('latitude') latitude: string,
  ) {
    const data = await this.vehicleService.findNearest(
      Number(latitude),
      Number(longitude),
    );

    return {
      data,
      message: 'Nearest vehicles retrieved successfully',
    };
  }

  @Get('mitra/:mitraId')
  @Public()
  @ApiOkResponse({
    description: 'Get vehicles by mitra retrieved successfully',
    type: [GetVehicleByMitraEntity],
  })
  async findByMitra(
    @Param('mitraId') mitraId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;

    const data = await this.vehicleService.findAllByMitraId(+mitraId, userId);

    return {
      data,
      message: 'Vehicles by mitra retrieved successfully',
    };
  }

  @Get('category/:id')
  @Public()
  @ApiOkResponse({
    description: 'Vehicles by category retrieved successfully',
    type: [GetVehicleCategoryEntity],
  })
  async findByCategory(@Param('id') id: string) {
    const data = await this.vehicleService.findByCategeory(+id);
    return {
      data,
      message: 'Vehicles by category retrieved successfully',
    };
  }

  @Get(':id')
  @Public()
  @ApiOkResponse({
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
  @ApiOkResponse({
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
  @ApiOkResponse({
    description: 'Vehicle deleted successfully',
  })
  async remove(@Param('id') id: string) {
    return this.vehicleService.remove(+id);
  }
}
