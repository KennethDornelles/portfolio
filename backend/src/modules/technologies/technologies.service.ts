import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { ITechnologiesRepository } from './repositories/technologies.repository.interface';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class TechnologiesService {
  constructor(
    @Inject('ITechnologiesRepository')
    private technologiesRepository: ITechnologiesRepository,
  ) {}

  async create(createTechnologyDto: CreateTechnologyDto) {
    const existing = await this.technologiesRepository.findByName(createTechnologyDto.name);
    if (existing) {
      throw new ConflictException('Technology with this name already exists');
    }
    return this.technologiesRepository.create(createTechnologyDto);
  }

  async findAll() {
    return this.technologiesRepository.findAll();
  }

  async findOne(id: string) {
    const tech = await this.technologiesRepository.findById(id);
    if (!tech) {
      throw new NotFoundException('Technology not found');
    }
    return tech;
  }

  async update(id: string, updateTechnologyDto: UpdateTechnologyDto) {
    await this.findOne(id); // Ensure exists
    return this.technologiesRepository.update(id, updateTechnologyDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    return this.technologiesRepository.delete(id);
  }
}
