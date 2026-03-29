import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../models/city';

@Component({
  selector: 'app-cities-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cities-list.component.html',
  styleUrl: './cities-list.component.css',
})
export class CitiesListComponent {
  @Input() cities: City[] = [];
}
