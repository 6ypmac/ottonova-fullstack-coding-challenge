import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CitiesService } from './cities.service';

describe('CitiesService', () => {
  let service: CitiesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CitiesService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CitiesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send request with correct query params', () => {
    service
      .getCities({
        search: 'tokyo',
        continent: 'Asia',
        sort: 'population:asc',
      })
      .subscribe();

    const req = httpMock.expectOne(
      (req) =>
        req.url.includes('/cities') &&
        req.params.get('search') === 'tokyo' &&
        req.params.get('continent') === 'Asia' &&
        req.params.get('sort') === 'population:asc',
    );

    expect(req.request.method).toBe('GET');

    req.flush({ success: true, data: [], total: 0 });
  });

  it('should not include empty params', () => {
    service
      .getCities({
        search: '',
        continent: undefined,
        sort: null as any,
      })
      .subscribe();

    const req = httpMock.expectOne(
      (req) =>
        req.url.includes('/cities') &&
        !req.params.has('search') &&
        !req.params.has('continent') &&
        !req.params.has('sort'),
    );

    expect(req.request.method).toBe('GET');

    req.flush({ success: true, data: [], total: 0 });
  });
});
