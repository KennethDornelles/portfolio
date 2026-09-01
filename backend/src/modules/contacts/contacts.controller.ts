import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit a contact form' })
  @ApiResponse({
    status: 201,
    description: 'The contact message has been successfully created.',
  })
  async create(@Body() createContactDto: CreateContactDto) {
    await this.contactsService.create(createContactDto);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'List all contact messages (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all messages.' })
  findAll() {
    return this.contactsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  @ApiResponse({ status: 200, description: 'Message marked as read.' })
  markAsRead(@Param('id') id: string) {
    return this.contactsService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message (Admin only)' })
  @ApiResponse({ status: 200, description: 'Message deleted.' })
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
