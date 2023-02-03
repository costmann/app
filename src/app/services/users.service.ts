import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IArea, ILaboratory, IRole, IUser } from './../models/interfaces';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${environment.apiUrl}/Users`)
  }

  saveUser(userName: string, roleId: number, laboratoryId: number | undefined, areas: IArea[] | undefined ): Observable<IUser> {
    return this.http.post<IUser>(`${environment.apiUrl}/Users`, {
      userName: userName,
      roleId: roleId,
      laboratoryId: laboratoryId,
      areas: areas
    }, httpOptions)
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Users/${encodeURIComponent(id)}`)
  }

  getLaboratories(): Observable<ILaboratory[]> {
    return this.http.get<ILaboratory[]>(`${environment.apiUrl}/Laboratories`)
  }

  getAreas(): Observable<IArea[]> {
    return this.http.get<IArea[]>(`${environment.apiUrl}/Areas`)
  }

  getRoles(): Observable<IRole[]> {
    return this.http.get<IRole[]>(`${environment.apiUrl}/Roles`)
  }

}
