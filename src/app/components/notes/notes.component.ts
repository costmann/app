import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAnalysisData, INote } from 'src/app/models/interfaces';

import { AddNoteDialogComponent } from './../dialogs/add-note-dialog/add-note-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { DeleteNoteDialogComponent } from '../dialogs/delete-note-dialog/delete-note-dialog.component';
import { HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { NotesDataSource } from 'src/app/services/notes.datasource';
import { NotesService } from './../../services/notes.service';
import { Roles } from 'src/app/models/user';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {

   _analysis: IAnalysisData | undefined

  @Output() back = new EventEmitter()

  // canAdd = true

  dataSource: NotesDataSource

  displayedColumns = ["description", "createdAt", "createdBy", "download", "delete", "dummy" ]

  selectedNote: INote | undefined

  readonly = false

  downloading = false
  downloadError = false

  constructor(private notesService: NotesService, public dialog: MatDialog, private authService: AuthService) {
    this.dataSource = new NotesDataSource(notesService)
  }

  get analysis(): IAnalysisData | undefined {
    return this._analysis
  }
  @Input() set analysis(value: IAnalysisData | undefined) {
    this._analysis = value

    this.readonly = !!this.authService ? this.authService.readonly(value?.confirmed) : true

    this.refresh()
  }

  onBack(): void {
    this.back.emit()
  }

  refresh(): void {
    if (!!this._analysis) this.dataSource.loadData(this._analysis.id)
  }

  add(): void {
    const dialogRef = this.dialog.open(AddNoteDialogComponent, {
      width: '500px',
      data: this.analysis
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refresh()
      }
    })
  }

  downloadAll(): void {
    if (!!this.analysis) {

      this.downloading = true
      this.downloadError = false

      this.notesService.downloadAll(this.analysis.id).subscribe({
        next: (response: HttpResponse<Blob>) => {
          if (!!response.body) {
            this.downloading = false
            let filename = 'file.zip'
            const contentDisposition = response.headers.get('content-disposition')
            if (!!contentDisposition) {
              filename = contentDisposition.split(';')[1].split('=')[1].replace(/\"/g, '')
            }
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(response.body)
            link.download = filename
            link.click()
          } else {
            this.downloading = false
            this.downloadError = true
            console.log('Response body is null!')
          }
        },
        error: (error) => {
          this.downloading = false
          this.downloadError = true
          console.log(error)
        },
      })
    }
  }

  downloadFile(note: INote): void {
    this.notesService.downloadFile(note.id).subscribe({
      next: (response: HttpResponse<Blob>) => {
        if (!!response.body) {
          let filename = note.originalFileName
          const contentDisposition = response.headers.get('content-disposition')
          if (!!contentDisposition) {
            filename = contentDisposition.split(';')[1].split('=')[1].replace(/\"/g, '')
          }
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(response.body)
          link.download = filename
          link.click()
        } else {
          console.log('Response body is null!')
        }
      },
      error: (error) => {
        console.log(error)
      },
    })
  }

  deleteNote(note: INote): void {

    this.selectedNote = note

    const dialogRef = this.dialog.open(DeleteNoteDialogComponent, {
      width: '500px',
      data: note
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notesService.deleteNote(note.id).subscribe({
          next: () => {
            this.selectedNote = undefined
            this.refresh()
          },
          error: (e) => {
            this.selectedNote = undefined
            console.log(e.error)
          }
        })
      } else {
        this.selectedNote = undefined
      }
    })

  }

  canDelete(note: INote): boolean {

    const user = this.authService.userValue

    if (!!user) {
      return (note.createdBy === user.name) || (this.authService.isInRole([Roles.admin, Roles.manager]))
    }

    return false
  }

  isSelected(e: any): boolean {
    return e?.id == this.selectedNote?.id
  }
}
