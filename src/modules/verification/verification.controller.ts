import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerificationEntity } from './entities/verification.entity';
import type { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('verification')
@ApiTags('verification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'document_url', maxCount: 1 },
      { name: 'selfie_url', maxCount: 1 },
    ]),
  )
  @ApiCreatedResponse({
    description: 'Verification request created successfully',
    type: VerificationEntity,
  })
  async create(
    @Body() dto: CreateVerificationDto,
    @UploadedFiles()
    files: {
      document_url?: Express.Multer.File[];
      selfie_url?: Express.Multer.File[];
    },
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;

    const documentFile = files.document_url?.[0];
    const selfieFile = files.selfie_url?.[0];

    const data = await this.verificationService.create(
      dto,
      userId,
      documentFile,
      selfieFile,
    );

    return {
      data: data,
      message: 'Verification request created successfully',
    };
  }

  @Get('user')
  @ApiCreatedResponse({
    description: 'Get verification by user successfully',
    type: VerificationEntity,
  })
  async getVerificationByUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;

    const data = await this.verificationService.findByUserId(userId);

    return {
      data: data,
      message: 'Get verification by user successfully',
    };
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiCreatedResponse({
    description: 'Get all verifications from admin successfully',
    type: [VerificationEntity],
  })
  async findAll() {
    const data = await this.verificationService.findAll();

    return {
      data: data,
      message: 'Get all verifications from admin successfully',
    };
  }

  @Patch('verify/:id')
  @Roles(Role.ADMIN)
  @ApiCreatedResponse({
    description: 'User verification updated successfully',
    type: VerificationEntity,
  })
  async verifyFromAdmin(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateVerificationDto,
  ) {
    const userId = req.user.id;

    const data = await this.verificationService.verifyFromAdmin(
      userId,
      dto,
      id,
    );

    return {
      data: data,
      message: 'User verification updated successfully',
    };
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiCreatedResponse({
    description: 'Get detail verification successfully',
    type: VerificationEntity,
  })
  async findOne(@Param('id') id: number) {
    const data = await this.verificationService.findOne(id);

    return {
      data: data,
      message: 'Get detail verification successfully',
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiCreatedResponse({
    description: 'Delete verification successfully',
    type: Object,
  })
  async remove(@Param('id') id: number) {
    await this.verificationService.remove(id);
    return {
      message: 'Delete verification successfully',
    };
  }
}
