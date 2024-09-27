// AI confidence score for this refactoring: 86.50%
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCapitalizeFirstLetter]'
})
export class CapitalizeFirstLetterDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value) {
      input.value = value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
}

/* Issues:
1. The type of the event parameter in onInputChange should be more specific than Event.
2. The value variable can be declared as a constant since it is not reassigned.
*/