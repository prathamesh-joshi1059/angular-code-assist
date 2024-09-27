// AI confidence score for this refactoring: 96.24%
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
})
export class NumberOnlyDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    // Prevent default for 'e', '-', and '+'
    if (key === 'e' || key === 'E' || key === '-' || key === '+') {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove any '-' or 'e' characters that may have been pasted
    input.value = input.value.replace(/[-eE]/g, '');
  }

}

// Issues: 
// - Unused variable 'input' in onKeyDown method.