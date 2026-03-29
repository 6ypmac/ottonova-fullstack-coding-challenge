import { Component, Input } from '@angular/core';
import { City } from '../../models/city';

@Component({
  selector: 'app-cities-list',
  standalone: true,
  templateUrl: './cities-list.component.html',
  styleUrl: './cities-list.component.css',
})
export class CitiesListComponent {
  @Input() cities: City[] = [];
}
