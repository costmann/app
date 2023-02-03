import { FormControl, FormGroup } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ILaboratory } from 'src/app/models/interfaces';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Roles } from 'src/app/models/user';
import { SchedulerService } from 'src/app/services/scheduler.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-export-schedules-dialog',
  templateUrl: './export-schedules-dialog.component.html',
  styleUrls: ['./export-schedules-dialog.component.scss']
})
export class ExportSchedulesDialogComponent {

  laboratories$: Observable<ILaboratory[]>

  form: FormGroup

  hideLaboratories = false

  constructor(public dialogRef: MatDialogRef<ExportSchedulesDialogComponent>, private schedulerService: SchedulerService, authService: AuthService) {

    this.form = new FormGroup({
      laboratoryId: new FormControl(),
      start: new FormControl(null),
      end: new FormControl(null),
    })

    this.laboratories$ = schedulerService.getLaboratories().pipe(
      tap((items) => {
        if (!!items) {
          if (items.length === 1) {
            this.form.patchValue({'laboratoryId': items[0].id})
          }
        }
      })
    )

    this.hideLaboratories = authService.isInRole([Roles.analyst])

  }

  onSubmit(): void {
    const f = this.form.getRawValue()

    const data = {
      laboratoryId: f.laboratoryId,
      start: f.start.toDate().toISOString(),
      end: !!f.end ? f.end.toDate().toISOString() : null
    }

    this.schedulerService.exportSchedules(data).subscribe({
      next: (response: HttpResponse<Blob>) => {
        if (!!response.body) {
          const contentDisposition = response.headers.get('content-disposition')
          let filename = 'export.xlsx'
          if (!!contentDisposition) {
            filename = contentDisposition.split(';')[1].split('=')[1].replace(/\"/g, '')
          }
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(response.body)
          link.download = filename
          link.click()
          this.dialogRef.close(true)
        } else {
          console.log('Response body is null!')
        }

      },
      error: (error) => {
        console.log(error)
      },
    })

  }

}
