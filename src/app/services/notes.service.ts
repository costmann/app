import { HttpClient, HttpResponse } from '@angular/common/http';
import { IAddNote, INote } from '../models/interfaces';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }

  // getAnalysis(id: number): Observable<IAnalysisData> {
  //   return this.http.get<IAnalysisData>(`${environment.apiUrl}/Analyses/${id}`)
  // }

  getNotesByAnalysis(id: number): Observable<INote[]> {
    return this.http.get<INote[]>(`${environment.apiUrl}/Notes/Analysis/${id}`)
  }


  addNote(id: number, description: string, file: File | undefined): Observable<INote> {
    const formData = new FormData()
    formData.append('description', description)
    if (!!file) {
      formData.append('file', file, file.name)
    }
    return this.http.post<INote>(`${environment.apiUrl}/Notes/${id}`, formData)
  }

  downloadFile(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${environment.apiUrl}/Notes/Download/${id}`, {
      responseType: 'blob',
      observe: 'response',
    })
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Notes/${id}`)
  }

  downloadAll(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${environment.apiUrl}/Notes/DownloadAllFiles/${id}`, {
      responseType: 'blob',
      observe: 'response',
    })
  }

}
