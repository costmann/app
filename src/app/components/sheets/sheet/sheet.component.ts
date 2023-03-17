import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IConfirmationResponse, ISheet } from 'src/app/models/interfaces';

import { AuthService } from 'src/app/services/auth.service';
import { ConfirmSheetDialogComponent } from '../../dialogs/confirm-sheet-dialog/confirm-sheet-dialog.component';
import { DeleteSheetDialogComponent } from './../../dialogs/delete-sheet-dialog/delete-sheet-dialog.component';
import { HttpResponse } from '@angular/common/http';
import { IAnalysis } from 'src/app/models/analysis-interfaces';
import { MatDialog } from '@angular/material/dialog';
import { Roles } from 'src/app/models/user';
import { Router } from '@angular/router';
import { SaveSheetDialogComponent } from '../../dialogs/save-sheet-dialog/save-sheet-dialog.component';
import { SheetsService } from './../../../services/sheets.service';
import { T1Component } from '../t1/t1.component';
import { T2Component } from '../t2/t2.component';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss']
})
export class SheetComponent {

  _id: number | undefined
  _revision: boolean | undefined

  dataSheet: ISheet | undefined

  scales = ['40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100']
  private _scale = '100'

  public get scale() {
    return this._scale
  }

  public set scale(value: string) {

    if (value !== this._scale) {
      this._scale = value
      this.center()
    }
  }

  @ViewChild('container') sheet!: ElementRef
  @ViewChild(T1Component) t1!: T1Component
  @ViewChild(T2Component) t2!: T2Component

  @Output() back = new EventEmitter()
  @Output() refresh = new EventEmitter<ISheet>()
  @Output() notes = new EventEmitter()

  canSave = false
  canConsolidate = false
  canDelete = false

  canDownload = false
  isChanged = false
  isAuthority: boolean

  readonly = false

  constructor(private sheetService: SheetsService, public dialog: MatDialog, private router: Router, private authService: AuthService) {
    const s = window.sessionStorage.getItem('scale')
    if (!!s) {
      this.scale = s
    }

    this.isAuthority = this.authService.isInRole([Roles.authority])

  }

  reload(): void {
    if(!!this.id && (this._revision != undefined)) {

      this.sheetService.getSheet(this.id, !this.revision).subscribe({
        next: (result) => {
          this.dataSheet = result

          this.canSave = !this.dataSheet.confirmed || this.revision
          this.canConsolidate = !this.dataSheet.confirmed && !!this.dataSheet.json
          this.canDelete = !this.dataSheet.confirmed && !!this.dataSheet.json
          this.canDownload = !!this.dataSheet.json
          this.isChanged = !!this.dataSheet.modifiedAt
        },
        error: () => {
          this.dataSheet = undefined
          this.canSave = false
          this.canConsolidate = false
          this.canDelete = false
        }
      })

    } else {
      this.canSave = false
      this.canConsolidate = false
      this.canDelete = false
      this.dataSheet = undefined
    }
  }

  get id(): number | undefined {
    return this._id
  }
  @Input() set id(value: number | undefined) {
    this._id = value
    this.reload()
  }

  get revision(): boolean {
    return this._revision ?? false
  }

  @Input() set revision(value: boolean) {
    this._revision = value

    this.readonly = this.authService.readonly(value)

    this.reload()
  }

  getScaleIndex(): number {
    const index = this.scales.findIndex(s => s === this.scale)
    if (index === -1) {
      return this.scales.length -1
    }
    return index
  }

  zoomIn(): void {
    let scaleIndex = this.getScaleIndex()
    if (scaleIndex < this.scales.length-1) {
      scaleIndex++
      this.scale = this.scales[scaleIndex]
      window.sessionStorage.setItem('scale', this.scale)
      // this.center()
    }
  }

  zoomOut(): void {
    let scaleIndex = this.getScaleIndex()
    if (scaleIndex > 0) {
      scaleIndex--
      this.scale = this.scales[scaleIndex]
      window.sessionStorage.setItem('scale', this.scale)
      // this.center()
    }
  }

  center(): void {
    if ((!!this.sheet) && (!!this.sheet.nativeElement)) {
      const top = (this.sheet.nativeElement.scrollHeight - this.sheet.nativeElement.clientHeight) / 2
      this.sheet.nativeElement.scrollTo({top: top})
      window.sessionStorage.setItem('scale', this.scale)
    }


  }

  canZoomIn(): boolean {
    return this.getScaleIndex() < this.scales.length-1
  }

  canZoomOut(): boolean {
    return this.getScaleIndex() > 0
  }


  onBack(): void {

    if (this.dirty() && this.dataSheet?.confirmed === false)  {
      const dialogRef = this.dialog.open(SaveSheetDialogComponent, {
        width: '500px',
        data: this.dataSheet
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.save(this.back)
        } else {
          this.back.emit()
        }
      })

    } else {
      this.back.emit()
    }
  }

  onNotes(): void {
    if (this.dirty() && this.dataSheet?.confirmed === false)  {
      const dialogRef = this.dialog.open(SaveSheetDialogComponent, {
        width: '500px',
        data: this.dataSheet
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.save(this.notes)
        } else {
          this.notes.emit()
        }
      })

    } else {
      this.notes.emit()
    }
  }



  dirty(): boolean {

    if (!!this.t1) {
      return this.t1.analysis.dirty()
    }

    if (!!this.t2) {
      return this.t2.analysis.dirty()
    }

    return false
  }

  disable(): void {

    if (!!this.t1) {
      this.t1.analysis.disable()
      return
    }

    if (!!this.t2) {
      this.t2.analysis.disable()
      return
    }
  }

  save(e: EventEmitter<any> | undefined = undefined): void {

    let data: IAnalysis | undefined

    if (!!this.t1) {
      data = this.t1.save()
    }

    if (!!this.t2) {
      data = this.t2.save()
    }

    if ((!!data) && (!!this.id)) {
      this.sheetService.saveSheet(this.id, JSON.stringify(data)).subscribe({
        next: (result) => {
          this.canConsolidate = !!result.json && !result.confirmed
          this.canDelete = !!result.json && !result.confirmed
          this.canDownload = !!result.json
          this.isChanged = !!result.modifiedAt
          this.dataSheet!.modifiedAt = result.modifiedAt
          this.refresh.emit(result)
          if (!!e) {
            e.emit()
          }
        }
      })
    }
  }

  delete(): void {
    if (!!this.id) {
      this.sheetService.deleteSheet(this.id).subscribe({
        next: (result) => {
          this.refresh.emit()
          this.back.emit()
        },
        error: (e) => {
          console.log(e)
        }
      })
    }
  }

  confirmDeletion(): void {
    const dialogRef = this.dialog.open(DeleteSheetDialogComponent, {
      width: '500px',
      data: this.dataSheet
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete()
      }
    })
  }

  confirmConfirmation(): void {
    const dialogRef = this.dialog.open(ConfirmSheetDialogComponent, {
      width: '600px',
      data: this.dataSheet
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.setConfirmation()
      }
    })
  }

  setConfirmation(): void {
    if (!!this.dataSheet) {
      this.sheetService.setConfirmation(this.dataSheet.id).subscribe({
        next:(response: IConfirmationResponse) => {
          this.canDelete = false
          this.canSave = false

          this.dataSheet!.confirmed = response.confirmed
          this.dataSheet!.sent = response.sent

          this.disable()
          this.refresh.emit(this.dataSheet)
        },
        error:(err) => {
          console.log(err)
        }
      })
    }
  }

  download(confirmed: (boolean | null) = null): void {
    if (!!this.dataSheet) {
      this.sheetService.downloadReport(this.dataSheet.id, confirmed).subscribe({
        next: (response: HttpResponse<Blob>) => {
          if (!!response.body) {
            const contentDisposition = response.headers.get('content-disposition')
            let filename = this.dataSheet!.id.toString() + '.xlsx'
            if (!!contentDisposition) {
              filename = contentDisposition.split(';')[1].split('=')[1].replace(/\"/g, '')
            }
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(response.body)
            link.download = filename
            link.click()
          } else {
            console.log('response body is null!')
          }
        },
        error: (error) => {
          console.log(error)
        },
      })
    }
  }

}
