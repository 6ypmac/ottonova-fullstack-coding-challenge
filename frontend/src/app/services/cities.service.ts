import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CitiesResponse } from '../models/city';

export interface GetCitiesParams {
  search?: string;
  continent?: string;
  sort?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000';

  getCities(params: GetCitiesParams = {}) {
    const httpParams = new HttpParams({
      fromObject: this.buildParams(params),
    });

    return this.http.get<CitiesResponse>(`${this.apiUrl}/cities`, {
      params: httpParams,
    });
  }

  private buildParams(params: GetCitiesParams): Record<string, string> {
    return Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value != null && value !== '') {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
  }
}
