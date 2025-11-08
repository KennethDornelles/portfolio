import { Injectable } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  create(_createExperienceDto: CreateExperienceDto) {
    return 'This action adds a new experience';
  }

  findAll() {
    return 'This action returns all experience';
  }

  findOne(id: string) {
    return `This action returns a #${id} experience`;
  }

  update(id: string, _updateExperienceDto: UpdateExperienceDto) {
    return `This action updates a #${id} experience`;
  }

  remove(id: string) {
    return `This action removes a #${id} experience`;
  }
}
