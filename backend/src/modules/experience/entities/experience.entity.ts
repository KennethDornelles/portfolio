export class Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  location: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
