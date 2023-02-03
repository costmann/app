import { IArea } from './../../../models/interfaces';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-area-dialog',
  templateUrl: './delete-area-dialog.component.html',
  styleUrls: ['./delete-area-dialog.component.scss']
})
export class DeleteAreaDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IArea) { }

}
