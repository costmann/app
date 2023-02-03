import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IArea } from 'src/app/models/interfaces';
import { AreasService } from 'src/app/services/areas.service';


interface IData {
  action: string,
  title: string,
  element: IArea | null
}

@Component({
  selector: 'app-add-area-dialog',
  templateUrl: './add-area-dialog.component.html',
  styleUrls: ['./add-area-dialog.component.scss']
})
export class AddAreaDialogComponent implements OnInit {

  name = ''
  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<AddAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IData,
    private areasService: AreasService)
  { }

  ngOnInit(): void {
    if (!!this.data.element) {
      const a = this.data.element
      this.name = a.name
    }
  }

  isValid(): boolean {
    return !!this.name
  }

  save(): void {
    if (this.isValid()) {

      this.areasService.add(this.name).subscribe({
        next: () => {
          this.dialogRef.close(true)
        },
        error: (e) => {
          this.errorMessage = !!e.error ? e.error : 'Si è verificato un errore'
        }
      })

    }
  }

  edit(): void {
    if (this.isValid()) {

      if (!!this.data.element) {
        this.areasService.edit(this.data.element.id, this.name).subscribe({
          next: () => {
            this.dialogRef.close(true)
          },
          error: (e) => {
            this.errorMessage = !!e.error ? e.error : 'Si è verificato un errore'
          }
        })
      }
    }
  }

}
