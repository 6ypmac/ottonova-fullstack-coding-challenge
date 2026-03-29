import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  @Input() search = '';
  @Input() continent = '';
  @Input() sort = '';
  @Input() continents: string[] = [];
  @Input() isLoading = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() continentChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onSearch(value: string) {
    this.searchChange.emit(value);
  }

  onChange(value: string) {
    this.continentChange.emit(value);
  }

  onSort(value: string) {
    this.sortChange.emit(value);
  }
}
