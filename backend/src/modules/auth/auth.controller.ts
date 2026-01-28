import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RtGuard } from '../../common/guards/rt.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  Public,
  GetCurrentUser,
  GetCurrentUserId,
} from '../../common/decorators';
import { AuthDto } from './dto/auth.dto';
import { SignUpDto } from './dto/signup.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignUpDto) {
    // Note: UsersService.create expects Prisma.UserCreateInput, which matches SignUpDto fields but isn't typed as such locally without helper
    // For simplicity, we cast or map. In clean arch, we would map to Entity or input model.
    // Assuming matching fields for now. 
    // We map password to passwordHash in service, but service expects 'passwordHash' in input?
    // UsersService.create expects data.passwordHash.
    // We need to handle this.
    // Ideally, UsersService should accept a DTO or we map here.
    // Let's assume we pass what we have and let service handle or map here.
    // Actually UsersService.create takes Prisma.UserCreateInput which REQUIRES passwordHash.
    // We should map here.
    return this.usersService.create({
        email: dto.email,
        passwordHash: dto.password, // Temporary: Service will hash it again? 
        // Wait, UsersService.create receives data and HASHES it.
        // "const passwordHash = await bcrypt.hash(data.passwordHash, salt);"
        // So we pass the plain password as 'passwordHash' property? That's a bit confusing naming in Service but functional.
        // Yes: data.passwordHash is used as input source for hashing.
    });
  }

  @Public()
  @Post('signin')
  @ApiOperation({ summary: 'Login to the application' })
  @ApiResponse({ status: 200, description: 'Return access and refresh tokens.' })
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user); // returns tokens
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login to the application (alias)' })
  @ApiResponse({ status: 200, description: 'Return access and refresh tokens.' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto) {
    return this.signin(dto);
  }

  @Public()
  @Post('guest')
  @ApiOperation({ summary: 'Login as Guest (Demo Mode)' })
  @ApiResponse({ status: 200, description: 'Return access token for guest.' })
  @HttpCode(HttpStatus.OK)
  async guestLogin() {
    return this.authService.loginAsGuest();
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout the current user' })
  @ApiResponse({ status: 200, description: 'User has been logged out.' })
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access tokens' })
  @ApiResponse({ status: 200, description: 'Return new access and refresh tokens.' })
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
