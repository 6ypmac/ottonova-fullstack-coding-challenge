import { Component, OnInit, inject } from '@angular/core';
import { CitiesService } from './services/cities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private citiesService = inject(CitiesService);

  cities: any[] = [];

  ngOnInit() {
    this.citiesService.getCities().subscribe((res: any) => {
      this.cities = res.data;
    });
  }
}
