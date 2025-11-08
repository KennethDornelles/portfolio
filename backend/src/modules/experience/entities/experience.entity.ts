export class Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  location?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
