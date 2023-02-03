import { IWasteForm, IRecyclingType, ILaboratory } from './../../../models/interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { SchedulerService } from 'src/app/services/scheduler.service';

@Component({
  selector: 'app-scheduler-dialog',
  templateUrl: './scheduler-dialog.component.html',
  styleUrls: ['./scheduler-dialog.component.scss']
})
export class SchedulerDialogComponent {

  types$: Observable<IRecyclingType[]>
  laboratories$: Observable<ILaboratory[]>

  hours$: Observable<string[]>

  form: FormGroup

  constructor(
    public dialogRef: MatDialogRef<SchedulerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IWasteForm,
    private schedulerService: SchedulerService)
  {

    this.form = new FormGroup({
      wasteFormId: new FormControl(data.id),
      id: new FormControl(!!data.schedule ? data.schedule.id : null),
      recyclingTypeId: new FormControl(),
      laboratoryId: new FormControl(),
      scheduledDate: new FormControl(!!data.schedule ? new Date(data.schedule.scheduledDate) : new Date()),
      scheduledTime: new FormControl()
    })

    this.types$ = schedulerService.getRecyclingTypes().pipe(
      tap((items) => {
        // console.log(items)
        if (!!items) {
          if (!!data.schedule) {
            this.form.patchValue({'recyclingTypeId': data.schedule.recyclingTypeId})
          } else {
            if (items.length === 1) {
              this.form.patchValue({'recyclingTypeId': items[0].id})
            }
          }
        }
      })
    )

    this.laboratories$ = schedulerService.getLaboratories().pipe(
      tap((items) => {
        // console.log(items)
        if (!!items) {
          if (!!data.schedule) {
            this.form.patchValue({'laboratoryId': data.schedule.laboratoryId})
          } else {
            if (items.length === 1) {
              this.form.patchValue({'laboratoryId': items[0].id})
            }
          }
        }
      })
    )

    this.hours$ = schedulerService.getHours().pipe(
      tap((hours) => {
        if (!!hours) {
          if (!!data.schedule) {
            const time = new Date(data.schedule.scheduledDate).toTimeString().substring(0,5)
            this.form.patchValue({'scheduledTime': time})
          }
        }
      })
    )

    if (!!data.schedule) {
      if (data.schedule.compiling === true || data.schedule.confirmed === true) {
        this.form.disable()
      }
    }

  }

  // ngOnInit(): void {
  //   console.log('SchedulerDialogComponent')
  // }

  // cancel(): void {
  //   this.dialogRef.close();
  // }

  onDelete(): void {
    const s = this.form.getRawValue()


    this.schedulerService.deleteSchedule(s.id).subscribe({
      next: (result) => {
        this.data.schedule = null
        this.dialogRef.close(true)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  onSubmit(): void {
    const s = this.form.getRawValue()

    const d = new Date(s.scheduledDate)

    const time = (s.scheduledTime as string).split(":").map(s => +s)
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), time[0], time[1])

    const data = {
      wasteFormId: this.data.id,
      number: this.data.number,
      formDate: this.data.formDate,
      authority: this.data.authority,
      producer: this.data.producer,
      plant: this.data.plant,
      consignee: this.data.consignee,
      district: this.data.district,
      hauler: this.data.hauler,
      samplingDate: this.data.samplingDate,
      ewc: this.data.ewc.trim(),
      quantity: this.data.quantity,
      recyclingTypeId: s.recyclingTypeId,
      laboratoryId: s.laboratoryId,
      scheduledDate: date,
    }

    this.schedulerService.postSchedule(data).subscribe({
      next: (result) => {
        this.data.schedule = result //.schedule
        this.dialogRef.close(true)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
