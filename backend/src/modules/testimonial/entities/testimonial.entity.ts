export class Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  message: string;
  avatar?: string;
  rating: number;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
