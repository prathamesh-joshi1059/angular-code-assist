import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCapitalizeFirstLetter]'
})
export class CapitalizeFirstLetterDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    if (value) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
      this.el.nativeElement.value = value;
    }
  }
}