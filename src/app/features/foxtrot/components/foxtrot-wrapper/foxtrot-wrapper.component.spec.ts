import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoxtrotWrapperComponent } from './foxtrot-wrapper.component';

describe('FoxtrotWrapperComponent', () => {
  let component: FoxtrotWrapperComponent;
  let fixture: ComponentFixture<FoxtrotWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoxtrotWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoxtrotWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
