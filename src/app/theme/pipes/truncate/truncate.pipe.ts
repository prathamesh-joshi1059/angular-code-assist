// AI confidence score for this refactoring: 71.02%
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 10): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}

// Issues:
// - 'args' is implicitly any; it should have a type defined.
// - 'parseInt' should have a radix parameter.
// - The default limit value should be handled in the function signature instead of inside the function.