import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { CreatePartnerDocumentDto } from './dto/create-partner-document.dto';
import { UpdatePartnerDocumentDto } from './dto/update-partner-document.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import type { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import { GetDetailPartnerDocumentEntity } from './entities/get-detail-partner-document.entity';
import { PartnerDocumentService } from './partner-document.service';
import { CheckUploadPartnerDocumentEntity } from './entities/check-upload-partner-document.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('partner-documents')
@ApiTags('Partner Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PartnerDocumentController {
  constructor(
    private readonly partnerDocumentsService: PartnerDocumentService,
  ) {}

  @Roles(Role.PARTNER)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'nib_document', maxCount: 1 },
      { name: 'npwp_document', maxCount: 1 },
      { name: 'bank_account_document', maxCount: 1 },
    ]),
  )
  @ApiCreatedResponse({
    description: 'Partner document created successfully',
    type: GetDetailPartnerDocumentEntity,
  })
  async create(
    @Body() dto: CreatePartnerDocumentDto,
    @UploadedFiles()
    files: {
      nib_document: Express.Multer.File[];
      npwp_document: Express.Multer.File[];
      bank_account_document: Express.Multer.File[];
    },
    @Req() req: AuthenticatedRequest,
  ) {
    const nib = files.nib_document?.[0];
    const npwp = files.npwp_document?.[0];
    const bank = files.bank_account_document?.[0];

    const userId = req.user.id;
    const data = await this.partnerDocumentsService.create(dto, userId, {
      nib_document: nib,
      npwp_document: npwp,
      bank_account_document: bank,
    });

    return {
      data,
      message: 'Partner document created successfully',
    };
  }

  @Get('check')
  @ApiOkResponse({
    description: 'Check if partner document already uploaded',
    type: CheckUploadPartnerDocumentEntity,
  })
  async checkUploaded(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.partnerDocumentsService.checkUploaded(userId);

    return {
      data,
      message: 'Partner document upload status retrieved successfully',
    };
  }

  @Get()
  @ApiOkResponse({
    description: 'Get all partner documents',
    type: [GetDetailPartnerDocumentEntity],
  })
  async findAll() {
    const data = await this.partnerDocumentsService.findAll();
    return {
      data,
      message: 'Partner documents retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get partner document by id',
    type: GetDetailPartnerDocumentEntity,
  })
  async findById(@Param('id') id: string) {
    const data = await this.partnerDocumentsService.findById(+id);
    return {
      data,
      message: 'Partner document retrieved successfully',
    };
  }

  @Roles(Role.PARTNER)
  @Get('user/me')
  @ApiOkResponse({
    description: 'Get partner document for current mitra',
    type: GetDetailPartnerDocumentEntity,
  })
  async findByUserId(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.partnerDocumentsService.findByUserId(userId);
    return {
      data,
      message: 'Partner document retrieved successfully',
    };
  }

  @Roles(Role.PARTNER)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'nib_document', maxCount: 1 },
      { name: 'npwp_document', maxCount: 1 },
      { name: 'bank_account_document', maxCount: 1 },
    ]),
  )
  @ApiOkResponse({
    description: 'Partner document updated successfully',
    type: GetDetailPartnerDocumentEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePartnerDocumentDto,
    @UploadedFiles()
    files: {
      nib_document: Express.Multer.File;
      npwp_document: Express.Multer.File;
      bank_account_document: Express.Multer.File;
    },
    @Req() req: AuthenticatedRequest,
  ) {
    const nib = files?.nib_document;
    const npwp = files?.npwp_document;
    const bank = files?.bank_account_document;

    const userId = req.user.id;
    const data = await this.partnerDocumentsService.update(+id, dto, userId, {
      nib_document: nib,
      npwp_document: npwp,
      bank_account_document: bank,
    });

    return {
      data,
      message: 'Partner document updated successfully',
    };
  }

  @Roles(Role.PARTNER)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Partner document deleted successfully',
    type: GetDetailPartnerDocumentEntity,
  })
  async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.id;
    const data = await this.partnerDocumentsService.delete(+id, userId);
    return {
      data,
      message: 'Partner document deleted successfully',
    };
  }
}
