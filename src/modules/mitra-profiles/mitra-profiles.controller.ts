import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { MitraProfilesService } from './mitra-profiles.service';
import { CreateMitraProfileDto } from './dto/create-mitra-profile.dto';
import { UpdateMitraProfileDto } from './dto/update-mitra-profile.dto';
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
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import type { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetDetailMitraProfileEntity } from './entities/get-detail-mitra-profile.entity';
import { GetAllMitraProfileEntity } from './entities/get-mitra-profile.entity';
import { GetNearestMitraEntity } from './entities/get-nearest-mitra.entity';

@Controller('mitra-profiles')
@ApiTags('mitra-profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class MitraProfilesController {
  constructor(private readonly mitraProfilesService: MitraProfilesService) {}

  @Roles(Role.PARTNER)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'mitra_image', maxCount: 1 }]),
  )
  @ApiCreatedResponse({
    description: 'Mitra profile created successfully',
    type: GetDetailMitraProfileEntity,
  })
  async create(
    @Body() dto: CreateMitraProfileDto,
    @UploadedFiles()
    files: {
      mitra_image?: Express.Multer.File[];
    },
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const imageFile = files.mitra_image?.[0];
    const data = await this.mitraProfilesService.create(dto, userId, imageFile);

    return {
      data,
      message: 'Mitra profile created successfully',
    };
  }

  @Get()
  @ApiOkResponse({
    description: 'Get all mitra profiles',
    type: [GetAllMitraProfileEntity],
  })
  async findAll() {
    const data = await this.mitraProfilesService.findAll();
    return {
      data,
      message: 'Mitra profiles retrieved successfully',
    };
  }

  @Get('nearest')
  @ApiQuery({ name: 'longitude', required: true })
  @ApiQuery({ name: 'latitude', required: true })
  @ApiOkResponse({
    description: 'Get nearest mitra profiles',
    type: [GetNearestMitraEntity],
  })
  async findNearest(
    @Query('longitude') longitude: string,
    @Query('latitude') latitude: string,
  ) {
    const data = await this.mitraProfilesService.findNearest(
      Number(latitude),
      Number(longitude),
    );

    return {
      data,
      message: 'Nearest mitra profiles retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get mitra profile by id',
    type: GetDetailMitraProfileEntity,
  })
  async findById(@Param('id') id: string) {
    const data = await this.mitraProfilesService.findById(+id);
    return {
      data,
      message: 'Mitra profile retrieved successfully',
    };
  }

  @Roles(Role.PARTNER)
  @Get('user')
  @ApiOkResponse({
    description: 'Get mitra profile from user with role partner',
    type: GetDetailMitraProfileEntity,
  })
  async findByUserId(@Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.mitraProfilesService.findByUserId(userId);
    return {
      data,
      message: 'Mitra profile retrieved successfully',
    };
  }

  @Roles(Role.PARTNER)
  @Patch()
  @ApiOkResponse({
    description: 'Mitra profile updated successfully',
    type: GetDetailMitraProfileEntity,
  })
  async update(
    @Body() dto: UpdateMitraProfileDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const data = await this.mitraProfilesService.update(dto, userId);
    return {
      data,
      message: 'Mitra profile updated successfully',
    };
  }

  @Roles(Role.PARTNER)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Mitra profile deleted successfully',
    type: GetDetailMitraProfileEntity,
  })
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.id;
    const data = await this.mitraProfilesService.delete(+id, userId);
    return {
      data,
      message: 'Mitra profile deleted successfully',
    };
  }
}
