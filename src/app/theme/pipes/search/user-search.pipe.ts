// AI confidence score for this refactoring: 71.36%
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ 
  name: 'userSearch', 
  pure: false 
})
export class UserSearchPipe implements PipeTransform {
  transform(value: any[], searchText: string = ''): any[] {
    const regex = new RegExp(searchText, 'ig');
    if (value) {
      return value.filter(user => {
        const name = user.profile?.name || user.username;
        return name?.search(regex) !== -1;
      });
    }
    return [];
  }
}

// Issues:
// 1. Pipe name should be in camelCase.
// 2. Type for 'value' parameter should not be 'any'.
// 3. Missing return type on the transform method.
// 4. Unused 'args' parameter should be properly named or omitted.
// 5. Use optional chaining for accessing nested properties.
// 6. Return type should not be 'any' for better type safety.
// 7. Handle the case when 'value' is null or undefined properly.
// 8. The regex variable is not suitably named for its purpose.