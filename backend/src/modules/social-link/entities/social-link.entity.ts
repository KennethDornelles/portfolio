export class SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
