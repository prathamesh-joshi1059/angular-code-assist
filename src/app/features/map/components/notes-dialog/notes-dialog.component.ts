// AI confidence score for this refactoring: 89.79%
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MapViewService } from '../../services/map-view.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notes-dialog',
  templateUrl: './notes-dialog.component.html',
  styleUrls: ['./notes-dialog.component.scss'] // changed from styleUrl to styleUrls
})
export class NotesDialogComponent implements OnInit {

  notesForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NotesDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public matData: any,
    private fb: FormBuilder,
    private mapViewService: MapViewService,
    private toastr: ToastrService
  ) {
    this.notesForm = this.fb.group({
      orderId: [''],
      notes: ['', Validators.required]
    });
  }

  ngOnInit(): void { // added return type
    console.log(this.matData);
    
    if (this.matData.orderId) {
      this.notesForm.patchValue({
        orderId: this.matData.orderId,
        notes: this.matData.notes
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.notesForm.controls.notes.valid) {
      this.dialogRef.close(true);
      this.mapViewService.saveNotes(this.notesForm.value);
    } else {
      this.toastr.error('Please add note');
    }
  }
}

/*
- Missing return type for ngOnInit method
- Incorrect property name: styleUrl should be styleUrls
- The matData type is not explicitly defined
- notesForm should be defined in the constructor to ensure proper initialization
*/