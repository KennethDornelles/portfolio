import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { components } from '../api/generated';

export interface ProjectTechnology {
  name: string;
  icon?: string;
}

export interface AdminProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  technologies: ProjectTechnology[];
  repositoryUrl?: string;
  liveUrl?: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/projects`;

  list(): Observable<AdminProject[]> {
    return this.http.get<AdminProject[]>(this.endpoint);
  }

  create(payload: components['schemas']['CreateProjectDto']): Observable<AdminProject> {
    return this.http.post<AdminProject>(this.endpoint, payload);
  }

  update(id: string, payload: components['schemas']['UpdateProjectDto']): Observable<AdminProject> {
    return this.http.patch<AdminProject>(`${this.endpoint}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
