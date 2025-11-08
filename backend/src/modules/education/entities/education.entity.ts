export class Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string | null;
  grade: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
