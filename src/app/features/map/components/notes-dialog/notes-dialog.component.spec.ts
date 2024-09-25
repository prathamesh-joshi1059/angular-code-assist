import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDialogComponent } from './notes-dialog.component';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MapViewService } from '../../services/map-view.service';
import { of } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';

describe('NotesDialogComponent', () => {
  let component: NotesDialogComponent;
  let fixture: ComponentFixture<NotesDialogComponent>;

  let mockDialogRef;
  let mockMapViewService;
  let mockMatData;

  beforeEach(async () => {
    mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    mockMatData = {
      orderId: '123',
      notes: 'Initial note'
    };

    mockMapViewService = {
      saveNotes: jasmine.createSpy('saveNotes').and.returnValue(of(true))
    };

    await TestBed.configureTestingModule({
      declarations: [NotesDialogComponent],
      imports: [ReactiveFormsModule, ToastrModule.forRoot(), BrowserAnimationsModule, SharedModule],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatData },
        { provide: MapViewService, useValue: mockMapViewService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize the form with provided data', () => {
    expect(component.notesForm.value).toEqual({
      orderId: '123',
      notes: 'Initial note'
    });
  })

  it('should call close on the dialogRef when onCancel is called', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });


  it('should call close on the dialogRef with notes value when onSave is called', () => {
    component.notesForm.patchValue({
      notes: 'Updated note'
    });
    component.onSave();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });


});

