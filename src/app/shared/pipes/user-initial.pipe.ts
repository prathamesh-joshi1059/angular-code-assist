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
