import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterText',
  standalone: true,
})
export class FilterTextPipe implements PipeTransform {
  transform(value: string, searchText: string): string {
    if (!value || !searchText) {
      return value;
    }
    const lowerCaseValue = value.toLowerCase();
    const lowerCaseSearchText = searchText.toLowerCase();
    return lowerCaseValue.includes(lowerCaseSearchText) ? value : '';
  }
}
