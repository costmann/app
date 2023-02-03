import { BehaviorSubject, Observable, of } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

import { FormsService } from './forms.service';
import { IWasteForm } from '../models/interfaces';
import { finalize } from 'rxjs/operators';

export class FormsDataSource implements DataSource<IWasteForm> {
  private dataSubject = new BehaviorSubject<IWasteForm[]>([])
  public length$ = new BehaviorSubject<number>(0)

  private loadingSubject = new BehaviorSubject<boolean>(false);


  public loading$ = this.loadingSubject.asObservable()

  constructor(private formsService: FormsService) {}

  connect(collectionViewer: CollectionViewer): Observable<IWasteForm[]>  {
    return this.dataSubject.asObservable()
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete()
    this.loadingSubject.complete()
  }

  loadData(sortColumn: string, sortDirection: string, column = '', filter = '', start: Date | null, end: Date | null, pageIndex = 0, pageSize = 10): void {
    this.loadingSubject.next(true)

    this.formsService.findWasteForms(sortColumn, sortDirection, column, filter, start, end, pageIndex, pageSize).pipe(
      // catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(
      (result) => {
        this.dataSubject.next(result.data)
        this.length$.next(result.totalCount)
      }
    )

  }
}
