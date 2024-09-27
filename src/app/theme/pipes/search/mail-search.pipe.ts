// AI confidence score for this refactoring: 76.70%
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mailSearch'
})
export class MailSearchPipe implements PipeTransform {
  transform(value: any[], args?: string): any[] {
    if (!value || !args) {
      return value;
    }
    const searchText = new RegExp(args, 'ig');
    return value.filter((mail: any) => 
      mail.sender?.search(searchText) !== -1 || mail.subject?.search(searchText) !== -1
    );
  }
}

// Issues: 
// - Pipe name should be in camelCase according to Angular style guide.
// - Type of `value` and `args` should be more specific instead of using `any`.
// - Missing return statement for the case when `value` is falsy or `args` is not provided.
// - The method transform is implicitly returning undefined in some cases, which should be avoided.