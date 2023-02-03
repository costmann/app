import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';

import { AnalysesDataSource } from 'src/app/services/analyses.datasource';
import { AnalysesService } from 'src/app/services/analyses.service';
import { Column } from 'src/app/models/column';
import { Filter } from 'src/app/models/filter';
import { IAnalysisData } from 'src/app/models/interfaces';
import { ISheet } from './../../models/interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SessionService } from 'src/app/services/session.service';
import { T1Component } from './../sheets/t1/t1.component';
import { T2Component } from '../sheets/t2/t2.component';

@Component({
  selector: 'app-analyses',
  templateUrl: './analyses.component.html',
  styleUrls: ['./analyses.component.scss']
})
export class AnalysesComponent implements OnInit, AfterViewInit {

  dataSource: AnalysesDataSource

  defaultSortColumn = 'scheduledDate'
  defaultSortDirection: 'asc' | 'desc' = 'desc'
  defaultPageIndex = 0
  defaultPageSize = 10

  currentPageSize = this.defaultPageSize

  displayedColumns = ["compiling", "number", "formDate", "authority", "hauler",  "ewc", "samplingDate", "quantity", "scheduleInfo", "scheduledDate"]

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild('input') input!: ElementRef

  @ViewChild('container') sheet!: ElementRef

  @ViewChild(T1Component) t1!: T1Component
  @ViewChild(T2Component) t2!: T2Component

  filterColumn = ''

  columns: Column[] = [
    { name: 'number', description: 'Formulario' },
    { name: 'authority', description: 'Ente' },
    { name: 'producer', description: 'Produttore' },
    { name: 'plant', description: 'Impianto' },
    { name: 'consignee', description: 'Destinatario' },
    { name: 'district', description: 'Comune' },
    { name: 'ewc', description: 'CER' },
    { name: 'recyclingTypeName', description: 'Tipologia di raccolta' },
  ]

  rangeDate: FormGroup

  currentAnalysis: IAnalysisData | undefined
  hideTable = false

  filter: Filter

  _showNotes = false


  constructor(analysesService: AnalysesService, session: SessionService, private route: ActivatedRoute, private router: Router) {

    session.init('analyses')

    this.dataSource = new AnalysesDataSource(analysesService)

    const jsonFilter = window.sessionStorage.getItem('AnalysesFilter')
    if (!!jsonFilter) {
      this.filter = JSON.parse(jsonFilter)
      this.rangeDate = new FormGroup({
        start: new FormControl(!!this.filter.start ? new Date(this.filter.start) : null),
        end: new FormControl(!!this.filter.end ? new Date(this.filter.end) : null),
      })
      this.filterColumn = this.filter.column
      this.currentPageSize = this.filter.pageSize
    } else {
      const today = new Date()
      // const start = new Date()
      // const end = new Date()
      // start.setDate(today.getDate() - 3)
      // end.setDate(today.getDate() + 3)
      // this.rangeDate = new FormGroup({
      //   start: new FormControl(start),
      //   end: new FormControl(end),
      // })
      this.rangeDate = new FormGroup({
        start: new FormControl(null),
        end: new FormControl(null),
      })
      this.filter = new Filter(this.defaultSortColumn, this.defaultSortDirection, this.filterColumn, '', this.rangeDate.value.start, this.rangeDate.value.end, 0, this.currentPageSize)
    }

    const json = window.sessionStorage.getItem('currentAnalysis')
    if (!!json) {
      this.currentAnalysis = JSON.parse(json)
      this.hideTable = true
    }

    const s = window.sessionStorage.getItem('showAnalysisNotes')
    if (!!s) {
      this.showNotes = (s.toLocaleLowerCase() === 'true')
    }

  }

  ngOnInit(): void {
    this.dataSource.loadData(this.filter)
  }

  ngAfterViewInit(): void {

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


  // convertDate(value: any): Date | null {
  //   if (!!value) {
  //     const d = new Date(value)
  //     return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  //   }
  //   return null
  // }

  loadData(): void {
    this.filter = new Filter(
      !!this.sort ? this.sort.active : this.defaultSortColumn,
      !!this.sort ? this.sort.direction : this.defaultSortDirection,
      this.filterColumn,
      this.input.nativeElement.value,
      this.rangeDate.value.start,
      this.rangeDate.value.end,
      !!this.paginator ? this.paginator.pageIndex : this.defaultPageIndex,
      !!this.paginator ? this.paginator.pageSize : this.defaultPageSize)

      window.sessionStorage.setItem('AnalysesFilter', JSON.stringify(this.filter))
      this.dataSource.loadData(this.filter)

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
    // window.localStorage.setItem('pageSize', this.paginator.pageSize.toString())
    // this.filter.pageSize = this.paginator.pageSize
    this.loadData()
  }

  plant(plant: string, discrict: string): string {
    if (plant.endsWith(discrict)) {
      return plant
    }
    return plant + ' - ' + discrict
  }

  rowClick(a: IAnalysisData): void {
    this.currentAnalysis = a
    this.hideTable = true
    window.sessionStorage.setItem('currentAnalysis', JSON.stringify(a))
  }

  back(): void {
    this.hideTable = false
    this.currentAnalysis = undefined
    window.sessionStorage.removeItem('currentAnalysis')

    const navigateTo = window.sessionStorage.getItem('navigateTo')
    if (!!navigateTo) {
      this.router.navigate([navigateTo]);
    }
  }

  refresh(sheet :ISheet | undefined): void {
    this.loadData()

    if (!!sheet) {
      if (sheet.confirmed) {
        this.back()
      }
    }
  }

  get showNotes(): boolean {
    return this._showNotes
  }
  @Input() set showNotes(value: boolean) {
    this._showNotes = value
    if (value) {
      window.sessionStorage.setItem('showAnalysisNotes', 'true')
    } else {
      window.sessionStorage.removeItem('showAnalysisNotes')
    }
  }

}
