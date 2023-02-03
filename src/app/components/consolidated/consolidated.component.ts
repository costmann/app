import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';

import { AnalysesDataSource } from 'src/app/services/analyses.datasource';
import { AuthService } from 'src/app/services/auth.service';
import { Column } from 'src/app/models/column';
import { ConsolidatedService } from 'src/app/services/consolidated.service';
import { Filter } from 'src/app/models/filter';
import { IAnalysisData } from 'src/app/models/interfaces';
import { ISheet } from './../../models/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Roles } from 'src/app/models/user';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionService } from 'src/app/services/session.service';
import { SetAreaDialogComponent } from '../dialogs/set-area-dialog/set-area-dialog.component';
import { T1Component } from './../sheets/t1/t1.component';
import { T2Component } from '../sheets/t2/t2.component';

@Component({
  selector: 'app-consolidated',
  templateUrl: './consolidated.component.html',
  styleUrls: ['./consolidated.component.scss']
})
export class ConsolidatedComponent implements OnInit, AfterViewInit {

  dataSource: AnalysesDataSource

  defaultSortColumn = 'confirmedAt'
  defaultSortDirection: 'asc' | 'desc' = 'desc'
  defaultPageIndex = 0
  defaultPageSize = 10

  currentPageSize = this.defaultPageSize

  displayedColumns = ["number", "area", "formDate", "authority", "ewc", "samplingDate", "scheduleInfo", "reportNumber", "scheduledDate", "analysisDate", "confirmedAt", "quantity", "actions"]

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild('input') input!: ElementRef

  @ViewChild('container') sheet!: ElementRef

  @ViewChild(T1Component) t1!: T1Component
  @ViewChild(T2Component) t2!: T2Component

  filterColumn = ''

  columns: Column[] = [
    { name: 'area', description: 'Area' },
    { name: 'number', description: 'Formulario' },
    { name: 'authority', description: 'Ente' },
    { name: 'producer', description: 'Produttore' },
    { name: 'plant', description: 'Impianto' },
    { name: 'consignee', description: 'Destinatario' },
    { name: 'district', description: 'Comune' },
    { name: 'ewc', description: 'CER' },
    { name: 'recyclingTypeName', description: 'Tipologia di raccolta' },
    { name: 'laboratoryName', description: 'Laboratorio' },
    { name: 'reportNumber', description: 'N° Report' },
  ]

  rangeDate: FormGroup

  currentAnalysis: IAnalysisData | undefined
  hideTable = false

  filter: Filter

  _showNotes = false

  selection = new SelectionModel<IAnalysisData>(true, []);

  canSetArea = false

  constructor(consolidatedService: ConsolidatedService, session: SessionService, private router: Router, authService: AuthService, public dialog: MatDialog) {

    session.init('consolidated')

    this.dataSource = new AnalysesDataSource(consolidatedService)

    this.canSetArea = authService.isInRole([Roles.admin, Roles.manager])

    if (this.canSetArea) {
      this.displayedColumns.unshift('select')
    }

    const jsonFilter = window.sessionStorage.getItem('ConsolidatedFilter')
    if (!!jsonFilter) {
      this.filter = JSON.parse(jsonFilter)
      this.rangeDate = new FormGroup({
        start: new FormControl(!!this.filter.start ? new Date(this.filter.start) : null),
        end: new FormControl(!!this.filter.end ? new Date(this.filter.end) : null),
      })
      this.filterColumn = this.filter.column
      this.currentPageSize = this.filter.pageSize
    } else {
      this.rangeDate = new FormGroup({
        start: new FormControl(null),
        end: new FormControl(null),
      })
      this.filter = new Filter(this.defaultSortColumn, this.defaultSortDirection, this.filterColumn, '', this.rangeDate.value.start, this.rangeDate.value.end, 0, this.currentPageSize)
    }

    const json = window.sessionStorage.getItem('currentConsolidated')
    if (!!json) {
      this.currentAnalysis = JSON.parse(json)
      this.hideTable = true
    }

    const s = window.sessionStorage.getItem('showConsolidatedNotes')
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

      window.sessionStorage.setItem('ConsolidatedFilter', JSON.stringify(this.filter))
      this.dataSource.loadData(this.filter)
      this.selection.clear();
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
    window.sessionStorage.setItem('currentConsolidated', JSON.stringify(a))
  }

  back(): void {
    this.hideTable = false
    this.currentAnalysis = undefined
    window.sessionStorage.removeItem('currentConsolidated')

    const navigateTo = window.sessionStorage.getItem('navigateTo')
    if (!!navigateTo) {
      this.router.navigate([navigateTo]);
    }
  }

  refresh(sheet :ISheet): void {
    this.loadData()
  }

  get showNotes(): boolean {
    return this._showNotes
  }
  @Input() set showNotes(value: boolean) {
    this._showNotes = value
    if (value) {
      window.sessionStorage.setItem('showConsolidatedNotes', 'true')
    } else {
      window.sessionStorage.removeItem('showConsolidatedNotes')
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  openAreaDialog(): void {

    const dialogRef = this.dialog.open(SetAreaDialogComponent, {
      width: '500px',
      data: this.selection.selected
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData()
      }
    })

  }

}
