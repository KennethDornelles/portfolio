import { Injectable } from '@nestjs/common';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';

@Injectable()
export class SocialLinkService {
  create(_createSocialLinkDto: CreateSocialLinkDto) {
    return 'This action adds a new socialLink';
  }

  findAll() {
    return `This action returns all socialLink`;
  }

  findOne(id: number) {
    return `This action returns a #${id} socialLink`;
  }

  update(id: number, _updateSocialLinkDto: UpdateSocialLinkDto) {
    return `This action updates a #${id} socialLink`;
  }

  remove(id: number) {
    return `This action removes a #${id} socialLink`;
  }
}
