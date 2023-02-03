import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotesService } from './../../../services/notes.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAnalysisData } from 'src/app/models/interfaces';

@Component({
  selector: 'app-add-note-dialog',
  templateUrl: './add-note-dialog.component.html',
  styleUrls: ['./add-note-dialog.component.scss']
})
export class AddNoteDialogComponent {

  // @ViewChild('fileInput') fileInput!: ElementRef


  description = new FormControl('', [Validators.required])
  file: File | undefined
  fileName = new FormControl('', [Validators.required])

  form = new FormGroup({
    description: this.description,
    file: new FormControl(null, [Validators.required]),
    fileName: this.fileName,
  })

  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<AddNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAnalysisData,
    private notesService: NotesService
  ) { }

  uploadFileEvt(e: any) {
    if (e.target.files && e.target.files[0]) {
      this.file = e.target.files[0]
      this.fileName.setValue(this.file!.name)
      // this.fileInput.nativeElement.value = ""
    } else {
      this.fileName.reset()
    }
  }

  save(): void {
    this.errorMessage = ''
    if (this.isValid()) {
      this.notesService.addNote(this.data.id, this.description.value!, this.file).subscribe({
        next: (note) => {
          this.dialogRef.close(true)
        },
        error: (e) => {
          this.errorMessage = !!e.error ? e.error : 'Si è verificato un errore'
        }
      })

      // this.dialogRef.close({
      //   id: this.data.id,
      //   description: this.description,
      //   file: this.file
      // })
    }
  }

  isValid(): boolean {
    return (!this.description.invalid && !this.fileName.invalid && !!this.file)
  }

}
