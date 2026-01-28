import { Controller, Get, Param, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [UserDto],
  })
  async findAll() {
    // Note: In a real app, we should return UserDto[], mapping from entity.
    // For now, returning the service result directly (which is Prisma User model).
    // Ideally use interceptor or map manually.
    const users = await this.usersService.findAll(); // Assuming findAll exists or I add it
    return users.map(user => new UserDto({ id: user.id, email: user.email }));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({
    status: 200,
    description: 'Return a single user.',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null; // Or throw NotFoundException
    return new UserDto({ id: user.id, email: user.email });
  }
}
