// AI confidence score for this refactoring: 73.39%
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userInitial',
})
export class UserInitialPipe implements PipeTransform {

  transform(fullName: string): string {
    if (!fullName) return '';
    const nameParts = fullName.split(' ');
    return nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }
}

// Issues: 
// 1. Missing return type for the transform method.
// 2. Lack of whitespace between decorators and class declaration.
// 3. Implicit any type for nameParts, should have an explicit type.
// 4. Inline methods could be broken down for clarity.