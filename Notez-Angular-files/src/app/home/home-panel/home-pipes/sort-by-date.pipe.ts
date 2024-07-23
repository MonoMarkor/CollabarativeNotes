import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByDate',
  standalone: true,
  pure: false,
})
export class SortByDatePipe implements PipeTransform {
  
  transform(items: any[], dateField: string): any[] {
    if (!items || !dateField) {
      return items;
    }
    return items.sort((a, b) => {
      const dateA = new Date(a[dateField]);
      const dateB = new Date(b[dateField]);
      return dateB.getTime() - dateA.getTime();
    });
  }
}
