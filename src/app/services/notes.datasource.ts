import { BehaviorSubject, Observable, of } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';

import { INote } from '../models/interfaces';
import { NotesService } from './notes.service';

export class NotesDataSource implements DataSource<INote> {
  private dataSubject = new BehaviorSubject<INote[]>([])
  public length$ = new BehaviorSubject<number>(0)

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable()

  constructor(private notesService: NotesService) {}

  connect(collectionViewer: CollectionViewer): Observable<INote[]>  {
    return this.dataSubject.asObservable()
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete()
    this.loadingSubject.complete()
  }

  loadData(analysisId: number): void {
    this.loadingSubject.next(true)

    this.notesService.getNotesByAnalysis(analysisId).pipe(
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
