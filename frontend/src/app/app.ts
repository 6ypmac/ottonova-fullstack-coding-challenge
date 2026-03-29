import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { City } from './models/city';

import { CitiesListComponent } from './components/cities-list/cities-list.component';
import { FiltersComponent } from './components/filters/filters.component';
import { CitiesService } from './services/cities.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, FiltersComponent, CitiesListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private citiesService = inject(CitiesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private search$ = new Subject<string>();

  cities: City[] = [];
  continents = ['Africa', 'Asia', 'Australia', 'Europe', 'North America', 'South America'];

  error = signal<string | null>(null);
  isLoading = signal(false);

  search = '';
  continent = '';
  sort = '';

  ngOnInit() {
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.router.navigate([], {
          queryParams: {
            search: value || null,
          },
          queryParamsHandling: 'merge',
        });
      });

    this.route.queryParams
      .pipe(
        switchMap((params) => {
          this.search = params['search'] || '';
          this.continent = params['continent'] || '';
          this.sort = params['sort'] || '';

          this.error.set(null);
          this.isLoading.set(true);

          return this.citiesService.getCities({
            search: this.search,
            continent: this.continent,
            sort: this.sort,
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.cities = res.data;
          this.isLoading.set(false);
        },
        error: () => {
          this.cities = [];
          this.error.set('Failed to load cities. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  onSearchInput(value: string) {
    this.search$.next(value);
  }

  onContinentChange(continent: string) {
    this.router.navigate([], {
      queryParams: {
        continent: continent || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(sort: string) {
    this.router.navigate([], {
      queryParams: {
        sort: sort || null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
