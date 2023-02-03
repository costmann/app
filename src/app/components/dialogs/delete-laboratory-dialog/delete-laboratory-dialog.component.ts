import { ILaboratory } from 'src/app/models/interfaces';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-laboratory-dialog',
  templateUrl: './delete-laboratory-dialog.component.html',
  styleUrls: ['./delete-laboratory-dialog.component.scss']
})
export class DeleteLaboratoryDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteLaboratoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ILaboratory) { }

}
