// AI confidence score for this refactoring: 84.88%
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'profilePicture' })
export class ProfilePicturePipe implements PipeTransform {
  transform(input: string, ext: string = 'jpg'): string {
    return `../assets/img/profile/${input}.${ext}`;
  }
}

// Issues: 
// 1. Implicit 'any' type for parameter 'ext'.
// 2. Use of string concatenation instead of template literals for constructing the URL.