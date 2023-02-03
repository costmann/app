import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { AnalysesDataSource } from 'src/app/services/analyses.datasource';
import { AuthService } from 'src/app/services/auth.service';
import { ExportSchedulesDialogComponent } from '../dialogs/export-schedules-dialog/export-schedules-dialog.component';
import { FindService } from 'src/app/services/find.service';
import { IAnalysisData } from 'src/app/models/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Roles } from 'src/app/models/user';
import { Router } from '@angular/router';
import { SessionService } from './../../services/session.service';

class Filter {
  constructor(sortColumn: string, sortDirection: SortDirection = 'asc', filter = '', pageIndex = 0, pageSize = 10) {
    this.sortColumn = sortColumn
    this.sortDirection = sortDirection
    this.filter = filter
    this.pageIndex = pageIndex
    this.pageSize = pageSize
  }
  public sortColumn
  public sortDirection
  public filter
  public pageIndex
  public pageSize
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('input') input!: ElementRef
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  dataSource: AnalysesDataSource

  filter = new Filter('scheduledDate', 'desc', '', 0, 10)

  displayedColumns = ["compiling", "number", "authority", "plant", "ewc", "laboratory", "recyclingType", "formDate", "samplingDate", "scheduledDate", "confirmedAt"]

  s1: Subscription | undefined
  s2: Subscription | undefined
  s3: Subscription | undefined

  selectedId = 0

  today: Date = new Date()

  constructor(session: SessionService, findService: FindService, private router: Router, public dialog: MatDialog, private authService: AuthService) {
    session.init()

    const jsonFilter = window.sessionStorage.getItem('HomeFilter')
    if (!!jsonFilter) {
      this.filter = JSON.parse(jsonFilter)
    }

    this.dataSource = new AnalysesDataSource(findService)

    const id = window.sessionStorage.getItem('selectedId')
    if (!!id) {
      this.selectedId = +id
    }

    this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate())
  }

  ngOnDestroy(): void {
    if (!!this.s1) {
      this.s1.unsubscribe()
    }
    if (!!this.s2) {
      this.s2.unsubscribe()
    }
    if (!!this.s2) {
      this.s2.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.refreshData()
  }

  ngAfterViewInit(): void {

    this.s1 = this.sort.sortChange.subscribe(() => {
      this.filter.sortColumn = this.sort.active
      this.filter.sortDirection = this.sort.direction
      this.paginator.pageIndex = 0
    })


    this.s2 = fromEvent(this.input.nativeElement,'keyup')
    .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
            this.paginator.pageIndex = 0
            this.loadData()
        })
    )
    .subscribe()

    this.s3 = merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadData())
    )
    .subscribe()


    setTimeout(()=>{
      this.input.nativeElement.focus();
    }, 0)
  }

  resetInput(): void {

    window.sessionStorage.removeItem('selectedId')
    this.selectedId = 0
    this.input.nativeElement.value = ''
    this.filter.filter = ''
    this.filter.pageIndex = 0
    this.loadData()
  }

  resizePage(): void {
    this.filter.pageSize = this.paginator.pageSize
    this.filter.pageIndex = this.paginator.pageIndex
    this.loadData()
  }

  loadData(): void {
      window.sessionStorage.setItem('HomeFilter', JSON.stringify(this.filter))
      this.refreshData()
  }

  refreshData(): void {
    this.dataSource.load(this.filter.filter, this.filter.sortColumn, this.filter.sortDirection, this.filter.pageIndex, this.filter.pageSize)
  }

  rowClick(a: IAnalysisData): void {
    const json = JSON.stringify(a)
    if (a.confirmed) {
      window.sessionStorage.setItem('currentConsolidated', json)
      this.router.navigate(['/consolidated']);
    } else {
      window.sessionStorage.setItem('currentAnalysis', json)
      this.router.navigate(['/analyses']);
    }

    window.sessionStorage.setItem('selectedId', a.id.toString())
    window.sessionStorage.setItem('navigateTo', '/home')

  }

  plant(plant: string, discrict: string): string {
    if (plant.endsWith(discrict)) {
      return plant
    }
    return plant + ' - ' + discrict
  }

  alarm(a: IAnalysisData): boolean {
    return !a.confirmed && !a.compiling && new Date(a.scheduledDate) < this.today
  }

  schedule(a: IAnalysisData): boolean {
    return !a.confirmed && !a.compiling && new Date(a.scheduledDate) >= this.today
  }

  export(): void {
    this.dialog.open(ExportSchedulesDialogComponent, {
      width: '400px',
    })
  }

  canExport(): boolean {
    return this.authService.isInRole([Roles.admin, Roles.manager, Roles.analyst, Roles.reader])
  }

}
