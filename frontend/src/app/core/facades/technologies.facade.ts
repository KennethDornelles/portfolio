import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { components } from '../api/generated';

export interface AdminTechnology {
  id: string;
  name: string;
  category: string;
  icon?: string;
  iconClass?: string;
  proficiencyLevel: number;
}

@Injectable({ providedIn: 'root' })
export class TechnologiesFacade {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/technologies`;

  list(): Observable<AdminTechnology[]> {
    return this.http.get<AdminTechnology[]>(this.endpoint);
  }

  create(payload: components['schemas']['CreateTechnologyDto']): Observable<AdminTechnology> {
    return this.http.post<AdminTechnology>(this.endpoint, payload);
  }

  update(
    id: string,
    payload: components['schemas']['UpdateTechnologyDto'],
  ): Observable<AdminTechnology> {
    return this.http.patch<AdminTechnology>(`${this.endpoint}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
