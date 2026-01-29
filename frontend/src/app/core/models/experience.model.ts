export interface Technology {
  name: string;
  color: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  focus: string;
  description?: string;
  cases?: string[];
  highlights?: string[];
  techStack: Technology[]; // Mapped from JSON
  startDate?: string;
  endDate?: string;
  order: number;
}
