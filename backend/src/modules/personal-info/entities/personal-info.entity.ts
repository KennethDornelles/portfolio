export class PersonalInfo {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  avatar?: string | null;
  resumeUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
