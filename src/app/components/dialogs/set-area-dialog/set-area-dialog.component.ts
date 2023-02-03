import { IAnalysisData } from './../../../models/interfaces';
import { AreasService } from 'src/app/services/areas.service';
import { Component, Inject, OnDestroy } from '@angular/core';
import { IArea } from 'src/app/models/interfaces';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-set-area-dialog',
  templateUrl: './set-area-dialog.component.html',
  styleUrls: ['./set-area-dialog.component.scss']
})
export class SetAreaDialogComponent implements OnDestroy {

  areas$: Observable<IArea[]>
  area: IArea | undefined
  analyses: IAnalysisData[] | undefined

  errorMessage = ''

  subscription: Subscription | undefined

  constructor(
    private areasService: AreasService,
    public dialogRef: MatDialogRef<SetAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAnalysisData[])
  {
      this.areas$ = areasService.get(false)

      this.analyses = data
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  save(): void {
    if (!!this.analyses && this.analyses.length > 0) {
      this.subscription = this.areasService.setArea(this.analyses.map(a => a.id), !!this.area ? this.area.id : null).subscribe({
        next: () => {
          this.dialogRef.close(true)
        },
        error: (e) => {
          this.errorMessage = 'Si è verificato un errore'
          console.log(e)
        }
      })
    }

  }

}
