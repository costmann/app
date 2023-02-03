import { BehaviorSubject, Observable, of } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';

import { IUser } from '../models/interfaces';
import { UsersService } from './users.service';

export class UsersDataSource implements DataSource<IUser> {
  private dataSubject = new BehaviorSubject<IUser[]>([])
  public length$ = new BehaviorSubject<number>(0)

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable()

  constructor(private service: UsersService) {}

  connect(collectionViewer: CollectionViewer): Observable<IUser[]>  {
    return this.dataSubject.asObservable()
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete()
    this.loadingSubject.complete()
  }

  loadData(): void {
    this.loadingSubject.next(true)

    this.service.getUsers().pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(
      (result) => {
        console.log(result)
        this.dataSubject.next(result)
        this.length$.next(result.length)
      }
    )
  }
}
