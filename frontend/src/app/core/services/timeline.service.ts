import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Experience } from '../models/experience.model';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/experiences`;

  getExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(this.apiUrl);
  }
}
