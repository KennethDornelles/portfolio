import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { PrismaService } from '../../database/prisma.service';
import { Testimonial } from './entities/testimonial.entity';

@Injectable()
export class TestimonialService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTestimonialDto: CreateTestimonialDto,
  ): Promise<Testimonial> {
    return await this.prisma.testimonial.create({
      data: createTestimonialDto,
    });
  }

  async findAll(): Promise<Testimonial[]> {
    return await this.prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findActive(): Promise<Testimonial[]> {
    return await this.prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return testimonial;
  }

  async update(
    id: string,
    updateTestimonialDto: UpdateTestimonialDto,
  ): Promise<Testimonial> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.testimonial.update({
      where: { id },
      data: updateTestimonialDto,
    });
  }

  async remove(id: string): Promise<Testimonial> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.testimonial.delete({
      where: { id },
    });
  }
}
