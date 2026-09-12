import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminContact {
  id: string;
  name: string;
  email: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ContactsFacade {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/contacts`;

  list(): Observable<AdminContact[]> {
    return this.http.get<AdminContact[]>(this.endpoint);
  }

  markAsRead(id: string): Observable<AdminContact> {
    return this.http.patch<AdminContact>(`${this.endpoint}/${id}/read`, {});
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
