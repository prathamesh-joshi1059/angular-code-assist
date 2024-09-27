// AI confidence score for this refactoring: 76.26%
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatPersonSearch'
})
export class ChatPersonSearchPipe implements PipeTransform {
  transform(value: any[], args?: string): any[] {
    if (!value || !args) {
      return value;
    }
    
    const searchText = new RegExp(args, 'ig');
    return value.filter(message => message.author?.search(searchText) !== -1);
  }
}

// Issues:
// 1. The pipe name should be in camelCase as per Angular Style Guide.
// 2. The 'value' parameter is typed as 'any', it should be an array type.
// 3. The 'args' parameter should be typed as 'string'.
// 4. The return type of the transform method is declared as 'any' instead of a specific type.
// 5. The transform method should handle cases where 'value' or 'args' are not provided.