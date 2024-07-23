import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat1',
  standalone: true,
})
export class DateFormat1Pipe implements PipeTransform {
  transform(value: Date): string {
    if (!value) {
      return '';
    }

    const dateValue = new Date(value);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - dateValue.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (daysDifference === 0) {
      return 'Today';
    } else if (daysDifference === 1) {
      return 'Yesterday';
    } else {
      return `${daysDifference} days ago`;
    }
  }
}
