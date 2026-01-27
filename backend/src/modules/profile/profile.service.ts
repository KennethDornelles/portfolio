import { Injectable, NotFoundException } from '@nestjs/common';
import { IProfileRepository } from './repositories/profile.repository.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private profileRepository: IProfileRepository) {}

  async getProfile(userId: string) {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
        // If profile doesn't exist, we can return a default one or 404.
        // For a seamless experience, maybe return empty object or null, but let's throw 404 for now
        // OR better: auto-create if not exists?
        // Let's stick to simple retrieval.
        throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // Check if profile exists, if not, create it
    const existingProfile = await this.profileRepository.findByUserId(userId);

    if (!existingProfile) {
        return this.profileRepository.create({
            userId,
            ...updateProfileDto,
        });
    }

    return this.profileRepository.update(userId, updateProfileDto);
  }
}
