export class Project {
  id: string;
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
