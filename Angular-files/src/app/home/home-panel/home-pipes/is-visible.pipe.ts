import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isVisible',
  standalone: true,
})
export class IsVisiblePipe implements PipeTransform {
  transform(value: string): boolean {
    return value !== '';
  }
}
