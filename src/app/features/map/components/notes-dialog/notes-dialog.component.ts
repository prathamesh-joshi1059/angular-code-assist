import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MapViewService } from '../../services/map-view.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-notes-dialog',
  templateUrl: './notes-dialog.component.html',
  styleUrl: './notes-dialog.component.scss'
})
export class NotesDialogComponent {

  constructor(public dialogRef: MatDialogRef<NotesDialogComponent>, @Inject(MAT_DIALOG_DATA) public matData,
    private fb: FormBuilder,
    private mapViewService : MapViewService,
    private toastr: ToastrService

  ) {}
  ngOnInit(){
    console.log(this.matData);
    
    if(this.matData.orderId){
      this.notesForm.patchValue({
        orderId:this.matData?.orderId,
        notes:this.matData?.notes
      })
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if(this.notesForm.controls.notes.valid){


      this.dialogRef.close(true);
      this.mapViewService.saveNotes(this.notesForm.value)
    } else{
      this.toastr.error('Please add note')
    }

  }

  

  notesForm = this.fb.group({
    orderId: ['',],
    notes: ['',Validators.required]
  })

}





