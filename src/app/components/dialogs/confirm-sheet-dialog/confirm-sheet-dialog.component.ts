import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISheet } from 'src/app/models/interfaces';

@Component({
  selector: 'app-confirm-sheet-dialog',
  templateUrl: './confirm-sheet-dialog.component.html',
  styleUrls: ['./confirm-sheet-dialog.component.scss']
})
export class ConfirmSheetDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmSheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISheet) { }

}
