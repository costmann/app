import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

import { ApiResult } from '../models/api-result';
import { Filter } from './../models/filter';
import { IAnalysisData } from '../models/interfaces';
import { finalize } from 'rxjs/operators';

export interface IAnalysesService {
  find(
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string,
    start: Date | null,
    end: Date | null,
    pageNumber: number,
    pageSize: number
  ): Observable<ApiResult<IAnalysisData>>
}


export class AnalysesDataSource implements DataSource<IAnalysisData> {

  private dataSubject = new BehaviorSubject<IAnalysisData[]>([])
  public length$ = new BehaviorSubject<number>(0)

  private loadingSubject = new BehaviorSubject<boolean>(false);


  public loading$ = this.loadingSubject.asObservable()

  constructor(private service: IAnalysesService) {}

  connect(collectionViewer: CollectionViewer): Observable<IAnalysisData[]>  {
    return this.dataSubject.asObservable()
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete()
    this.loadingSubject.complete()
  }

  loadData(filter: Filter): void {
    this.loadingSubject.next(true)

    this.service.find(
      filter.sortColumn,
      filter.sortDirection,
      filter.column,
      filter.filter,
      filter.start,
      filter.end,
      filter.pageIndex,
      filter.pageSize).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(
      (result) => {
        this.dataSubject.next(result.data)
        this.length$.next(result.totalCount)
      }
    )

  }

  load(filter: string, sortColumn: string, sortDirection: string, pageIndex: number, pageSize: number): void {

    if (!!filter) {

      this.loadingSubject.next(true)

      this.service.find(
        sortColumn,
        sortDirection,
        '',
        filter,
        null,
        null,
        pageIndex,
        pageSize).pipe(
        finalize(() => this.loadingSubject.next(false))
      ).subscribe(
        (result) => {
          this.dataSubject.next(result.data)
          this.length$.next(result.totalCount)
        }
      )

    } else {
      this.dataSubject.next([])
      this.length$.next(0)
    }

  }

  public get length(): number {
    return this.length$.value
  }

  public get data(): IAnalysisData[] {
    return this.dataSubject.value
  }

}
