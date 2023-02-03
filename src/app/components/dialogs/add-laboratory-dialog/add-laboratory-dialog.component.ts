import { Observable } from 'rxjs';
import { ILaboratory, IPicture } from 'src/app/models/interfaces';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { LaboratoriesService } from 'src/app/services/laboratories.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface IData {
  action: string,
  title: string,
  element: ILaboratory | null
}

@Component({
  selector: 'app-add-laboratory-dialog',
  templateUrl: './add-laboratory-dialog.component.html',
  styleUrls: ['./add-laboratory-dialog.component.scss']
})
export class AddLaboratoryDialogComponent implements OnInit {

  name = ''
  file: File | undefined
  fileName = ''

  imgUrl: any

  logo$: Observable<IPicture> | undefined

  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<AddLaboratoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IData,
    private laboratoriesService: LaboratoriesService)
  { }

  ngOnInit(): void {

    if (!!this.data.element) {

      const lab = this.data.element

      this.name = lab.name

      this.logo$ = this.laboratoriesService.getLogo(lab.id)

    }

  }

  // uploadFileEvt(e: any) {
  //   if (e.target.files && e.target.files[0]) {
  //     this.file = e.target.files[0]
  //     this.fileName = this.file!.name
  //   } else {
  //     this.fileName = ''
  //   }
  // }

  uploadFileEvt(e: any) {
    this.fileName = ''
    this.imgUrl = null
    if (e.target.files && e.target.files[0]) {
      this.file = e.target.files[0]

      if (!!this.file) {
        this.fileName = this.file.name
        const mimeType = this.file.type
        if (mimeType.match(/image\/*/) == null) {
          return
        }

        const reader = new FileReader()
        reader.readAsDataURL(this.file)
        reader.onload = (e) => {
          this.imgUrl = reader.result
        }
      }
    }
  }

  isValid(): boolean {
    return !!this.name
  }

  save(): void {
    if (this.isValid()) {

      this.laboratoriesService.add(this.name, this.file).subscribe({
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
        this.laboratoriesService.edit(this.data.element.id, this.name).subscribe({
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

  uploadLogo(): void {

    if (!!this.data.element) {
      this.laboratoriesService.changeLogo(this.data.element.id, this.file).subscribe({
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
