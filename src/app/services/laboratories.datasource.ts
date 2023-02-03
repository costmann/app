import { BehaviorSubject, Observable, of } from "rxjs";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { catchError, finalize } from "rxjs/operators";

import { ILaboratory } from "../models/interfaces";
import { LaboratoriesService } from "./laboratories.service";

export class LaboratoriesDataSource implements DataSource<ILaboratory> {
  private dataSubject = new BehaviorSubject<ILaboratory[]>([])
  public length$ = new BehaviorSubject<number>(0)

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable()

  constructor(private service: LaboratoriesService) {}

  connect(collectionViewer: CollectionViewer): Observable<ILaboratory[]>  {
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
