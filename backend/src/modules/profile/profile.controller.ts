import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtPayload } from '../auth/auth.types';

type AuthenticatedRequest = ExpressRequest & { user: JwtPayload };
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return the profile.' })
  getProfile(@Request() req: AuthenticatedRequest) {
    return this.profileService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'The profile has been successfully updated.',
  })
  updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user.sub, updateProfileDto);
  }
}
