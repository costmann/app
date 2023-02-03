import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { Column } from 'src/app/models/column';
import { FormsDataSource } from 'src/app/services/forms.datasource';
import { FormsService } from './../../services/forms.service';
import { IWasteForm } from './../../models/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Roles } from 'src/app/models/user';
import { SchedulerDialogComponent } from './../dialogs/scheduler-dialog/scheduler-dialog.component';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.scss'],
})
export class SchedulingComponent implements OnInit, AfterViewInit  {

  dataSource: FormsDataSource

  defaultSortColumn = 'number'
  defaultSortDirection: 'asc' | 'desc' = 'desc'
  defaultPageIndex = 0
  defaultPageSize = 10

  currentPageSize = this.defaultPageSize

  displayedColumns = ["state", "number", "date", "authority", "hauler", "ewc", "samplingDate", "quantity", "scheduleInfo", "scheduleDate"]

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild('input') input!: ElementRef

  filterColumn = ''

  columns: Column[] = [
    { name: 'number', description: 'Formulario' },
    { name: 'authority', description: 'Ente' },
    { name: 'producer', description: 'Produttore' },
    { name: 'plant', description: 'Impianto' },
    { name: 'consignee', description: 'Destinatario' },
    { name: 'district', description: 'Comune' },
    { name: 'ewc', description: 'CER' },
  ]

  rangeDate: FormGroup
  canSchedule = false

  constructor(public dialog: MatDialog, private formsService: FormsService, session: SessionService, authService: AuthService) {

    session.init()

    this.dataSource = new FormsDataSource(formsService)

    this.rangeDate = new FormGroup({
      start: new FormControl(null),
      end: new FormControl(null),
    })

    const pageSize = window.localStorage.getItem('pageSize')
    if (!!pageSize) {
      this.currentPageSize = +pageSize
    }

    this.canSchedule = authService.isInRole([Roles.admin, Roles.manager])
  }

  ngOnInit(): void {
    this.dataSource.loadData(this.defaultSortColumn, this.defaultSortDirection, '', '', null, null, 0, this.currentPageSize)
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0)

    fromEvent(this.input.nativeElement,'keyup')
    .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
            this.paginator.pageIndex = 0

            this.loadData()
        })
    )
    .subscribe()

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadData())
    )
    .subscribe()

  }

  resetInput(): void {
    this.input.nativeElement.value = ''
    this.loadData()
  }

  resetDate(): void {
    this.rangeDate.setValue({'start': null, 'end': null})
    this.loadData()
  }

  resizePage(): void {
    window.localStorage.setItem('pageSize', this.paginator.pageSize.toString())
    this.loadData()
  }

  loadData(): void {
    this.dataSource.loadData(
      !!this.sort ? this.sort.active : this.defaultSortColumn,
      !!this.sort ? this.sort.direction : this.defaultSortDirection,
      this.filterColumn,
      this.input.nativeElement.value,
      this.rangeDate.value.start,
      this.rangeDate.value.end,
      this.paginator.pageIndex,
      this.paginator.pageSize)
  }

  fix(value: string): string {
    return value.replace('_', ' - ')
  }

  plant(plant: string, discrict: string): string {
    if (plant.endsWith(discrict)) {
      return plant
    }
    return plant + ' - ' + discrict
  }

  rowClick(f: IWasteForm): void {

    if (!this.canSchedule) {
      return
    }

    const dialogRef = this.dialog.open(SchedulerDialogComponent, {
      width: '400px',
      data: f
    });

    dialogRef.afterClosed().subscribe((result) => {

    });

  }
}
