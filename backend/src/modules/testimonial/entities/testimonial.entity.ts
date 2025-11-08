export class Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  message: string;
  avatar: string | null;
  rating: number | null;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
