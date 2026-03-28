import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CitiesResponse } from '../models/city';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000';

  getCities(params: { search?: string; continent?: string; sort?: string }) {
    let httpParams = new HttpParams();

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    if (params.continent) {
      httpParams = httpParams.set('continent', params.continent);
    }

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    return this.http.get<CitiesResponse>(`${this.apiUrl}/cities`, {
      params: httpParams,
    });
  }
}
