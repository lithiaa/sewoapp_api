import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { UserEntity } from './entities/user.entity';
import type { AuthenticatedRequest } from 'src/common/interfaces/request.interface';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get()
  @ApiOkResponse({
    description: 'List of all users',
    type: [UserEntity],
  })
  async findAll() {
    const data = await this.userService.getAllUsers();

    return {
      data,
      message: 'Users retrieved successfully',
    };
  }

  @Get('current')
  @ApiOkResponse({
    description: 'Current authenticated user details',
    type: UserEntity,
  })
  async getCurrentUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.userService.getUserById(userId);

    return {
      data,
      message: 'Current user retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'User details',
    type: UserEntity,
  })
  async findOne(@Param('id') id: string) {
    const data = await this.userService.getUserById(+id);

    return {
      data,
      message: 'User retrieved successfully',
    };
  }
}
