import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISheet } from 'src/app/models/interfaces';

@Component({
  selector: 'app-save-sheet-dialog',
  templateUrl: './save-sheet-dialog.component.html',
  styleUrls: ['./save-sheet-dialog.component.scss']
})
export class SaveSheetDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SaveSheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISheet) { }

}
