import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLen',
  standalone: true,
})
export class MaxLenPipe implements PipeTransform {
  transform(value: string): string {
   if (!value || value.trim() === '') {
     return 'Untitled';
   }
    return value.length > 12 ? value.substring(0, 12) +".." : value;
  }
}
