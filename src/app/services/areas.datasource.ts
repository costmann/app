import { BehaviorSubject, Observable, of } from "rxjs";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { catchError, finalize } from "rxjs/operators";

import { AreasService } from "./areas.service";
import { IArea } from "../models/interfaces";

export class AreasDataSource implements DataSource<IArea> {
  private dataSubject = new BehaviorSubject<IArea[]>([])
  public length$ = new BehaviorSubject<number>(0)

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable()

  constructor(private service: AreasService) {}

  connect(collectionViewer: CollectionViewer): Observable<IArea[]>  {
    return this.dataSubject.asObservable()
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete()
    this.loadingSubject.complete()
  }

  loadData(): void {
    this.loadingSubject.next(true)

    this.service.get().pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(
      (result) => {
        this.dataSubject.next(result)
        this.length$.next(result.length)
      }
    )
  }
}
