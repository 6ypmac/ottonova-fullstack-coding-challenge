import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000';

  getCities() {
    return this.http.get(`${this.apiUrl}/cities`);
  }
}
