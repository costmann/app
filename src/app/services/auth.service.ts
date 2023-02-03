import { BehaviorSubject, Observable, Subject, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Roles, User } from '../models/user'

import { Injectable } from '@angular/core'
import { JwtHelperService } from '@auth0/angular-jwt'
import { LoginResponse } from '../models/auth'
import { environment } from 'src/environments/environment'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

const TOKEN_KEY = 'auth-token'
const USER_KEY = 'auth-user'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | undefined>
  public user: Observable<User | undefined>

  private messageSubject: Subject<string | undefined>
  public message: Observable<string | undefined>

  private doneSubject: Subject<boolean>
  public done: Observable<boolean>


  constructor(private http: HttpClient) {

    let u: User | undefined
    const json = window.sessionStorage.getItem(USER_KEY)
    if (!!json) {
      u = JSON.parse(json)
    }
    this.userSubject = new BehaviorSubject<User | undefined>(u)
    this.user = this.userSubject.asObservable()

    this.messageSubject = new Subject<string | undefined>()
    this.message = this.messageSubject.asObservable()

    this.doneSubject = new Subject<boolean>()
    this.done = this.doneSubject.asObservable()

  }

  signIn(appname: string, username: string, password: string): void {
    this.http.post<LoginResponse>(
      `${environment.apiUrl}/user/authenticate`,
      {
        AppName: appname,
        UserName: username,
        Password: password,
      },
      httpOptions
    ).subscribe({
      next:(result) => {
        const user = this.createUser(result)
        window.sessionStorage.removeItem(TOKEN_KEY)
        window.sessionStorage.setItem(TOKEN_KEY, result.token)
        window.sessionStorage.removeItem(USER_KEY)
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user))

        this.userSubject.next(user)
      },
      error:(e) => {
        console.log(e)
        let errorMessage = 'Impossibile connettersi'
        if (!!e.error && !!e.error.message) {
          errorMessage = e.error.message
        } else {
          if (!!e.message) {
            errorMessage = e.message
          }
        }
        this.messageSubject.next(errorMessage)
      }
    })

  }

  signOut(): void {
    window.sessionStorage.clear()
    this.userSubject.next(undefined)
  }

  public get userValue(): User | undefined {
    return this.userSubject.value
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY)
  }

  private inRole(u: User, roles: string[]): boolean {
    return roles.filter(x => u.roles.indexOf(x) !== -1).length > 0
  }


  public isInRole(roles: string[]): boolean {
    if (!!this.userValue) {
      return this.inRole(this.userValue, roles)
      // const u = this.userValue
      // return roles.filter(x => u.roles.indexOf(x) !== -1).length > 0
    }
    return false
  }


  private createUser(data: LoginResponse): User {
    const user = new User()

    user.passwordExpirationDays = data.passwordExpirationDays
    const helper = new JwtHelperService()
    const token = helper.decodeToken(data.token)

    let key = 'winaccountname'
    user.name = token[key]
    key = 'unique_name'
    user.firstName = token[key]
    key = 'family_name'
    user.lastName = token[key]
    key = 'email'
    user.email = token[key]

    key = 'role'
    const r = token[key]
    if (Array.isArray(r)) {
      user.roles = r
    } else {
      user.roles.push(r)
    }

    key = 'iat'
    user.issuedAt = new Date(token[key] * 1000)
    key = 'exp'
    user.expirationTime = new Date(token[key] * 1000)
    key = 'nbf'
    user.notBefore = new Date(token[key] * 1000)


    user.menu.push({icon: 'home', path: '/home', description: 'Home'})

    if (this.inRole(user, [Roles.admin, Roles.manager, Roles.reader])) {
      user.menu.push({icon: 'today', path: '/scheduling', description: 'Programmazione'})
    }

    if (this.inRole(user, [Roles.admin, Roles.analyst, Roles.reader])) {
      user.menu.push({icon: 'science', path: '/analyses', description: 'Analisi'})
    }

    if (this.inRole(user, [Roles.admin, Roles.manager, Roles.analyst, Roles.reader, Roles.authority]))  {
      user.menu.push({icon: 'verified', path: '/consolidated', description: 'Analisi consolidate'})
    }

    if (this.inRole(user, [Roles.admin])) {
      user.menu.push({icon: 'manage_accounts', path: '/user-settings', description: 'Utenti'})
      user.menu.push({icon: 'biotech', path: '/laboratories', description: 'Laboratori'})
      user.menu.push({icon: 'pie_chart', path: '/areas', description: 'Aree'})
    }

    if (this.inRole(user, [Roles.admin, Roles.manager, Roles.reader, Roles.authority]))  {
      user.menu.push({icon: 'file_download', path: '/exports', description: 'Esportazioni'})
    }

    return user
  }

  public readonly(confirmed: boolean = false): boolean {

    if (confirmed === true) {
      return this.isInRole([Roles.reader, Roles.analyst, Roles.authority])
    } else {
      return this.isInRole([Roles.reader, Roles.authority])
    }

  }

  resetMessage(): void {
    this.messageSubject.next(undefined)
  }

  resetPassword(username: string, email: string): void {
    // if (username.includes(environment.domain) === false) {
    //   username = `${environment.domain}\\${username}`
    // }

    this.http.post<boolean>(
      `${environment.apiUrl}/user/passwordForgotten`,
      {
        UserName: username,
        Email: email,
      },
      httpOptions
    ).subscribe({
      next:(result) => {
        if (result) {
          this.doneSubject.next(true)
        }
      },
      error:(e) => {
        let errorMessage = 'Impossibile completare la richiesta'
        if (!!e.error.message) {
          errorMessage = e.error.message
        } else {
          if (!!e.message) {
            errorMessage = e.message
          }
        }
        this.messageSubject.next(errorMessage)
      }
    })

  }

  changePassword(oldPassword: string, newPassword: string): void {
    const user = this.userSubject.value
    if (!!user) {


      this.http.post<boolean>(
        `${environment.apiUrl}/user/passwordChange`,
        {
          UserName: user.name,
          OldPassword: oldPassword,
          NewPassword: newPassword
        },
        httpOptions
      ).subscribe({
        next:(result) => {
          if (result) {
            this.doneSubject.next(true)
          }
        },
        error:(e) => {
          let errorMessage = 'Impossibile completare la richiesta'
          if (!!e.error.message) {
            errorMessage = e.error.message
          } else {
            if (!!e.message) {
              errorMessage = e.message
            }
          }
          this.messageSubject.next(errorMessage)
        }
      })

    }
  }
}
