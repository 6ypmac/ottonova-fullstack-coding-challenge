import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitiesService } from './services/cities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { City } from './models/city';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
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
  error: string | null = null;
  isLoading = false;

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

          this.error = null;
          this.isLoading = true;

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
          this.isLoading = false;
        },
        error: () => {
          this.cities = [];
          this.error = 'Failed to load cities';
          this.isLoading = false;
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
