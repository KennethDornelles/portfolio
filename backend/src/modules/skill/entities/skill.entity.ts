import { SkillCategory } from '@prisma/client';

export class Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  icon: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
