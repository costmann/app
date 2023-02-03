import { ISheet } from 'src/app/models/interfaces';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-sheet-dialog',
  templateUrl: './delete-sheet-dialog.component.html',
  styleUrls: ['./delete-sheet-dialog.component.scss']
})
export class DeleteSheetDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteSheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISheet) { }

}
