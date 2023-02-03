import { ActivatedRoute, NavigationEnd, NavigationExtras, Router, UrlSegment } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { MenuItem, User } from './../models/user'
import { delay, filter, map, switchMap } from 'rxjs/operators'

import { AuthService } from './auth.service'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  private startMenuItem: MenuItem
  private startExpandedValue = true

  private itemSubject: BehaviorSubject<MenuItem>
  public item: Observable<MenuItem>

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  )
  {

    this.startMenuItem = new MenuItem()

    this.itemSubject = new BehaviorSubject<MenuItem>(this.startMenuItem)
    this.item = this.itemSubject.asObservable()

    this.router.events
    .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
            while (route.firstChild) {
                route = route.firstChild;
            }
            return route;
        }),
        switchMap((route) => route.url),
        delay(0)
    )
    .subscribe((url) => {
      const s: UrlSegment = url[0]
      if (!!this.authService.userValue) {
        const user = this.authService.userValue
        const path = `/${s.path}`
        let item = user.menu.find(i => i.path === path)
        if (!item) {
          item = new MenuItem()
          item.path = path
        }
        window.sessionStorage.setItem('egp.app.menu-item', JSON.stringify(item))
        this.itemSubject.next(item)
      }
    })

    authService.user.subscribe({
      next:(user) => {
        this.initMenu(user)
      }
    })

  }

  public navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(commands, extras)
  }

  private initMenu(user: User | undefined): void {
    if (!!user) {

      let item: MenuItem | undefined = user.startMenuItem

      const json = window.sessionStorage.getItem('egp.app.menu-item')
      if (!!json) {
        item = JSON.parse(json)
      }

      if (!!item) {
        this.router.navigate([item.path])
      } else {
        const key = 'returnUrl'
        const returnUrl = this.activatedRoute.snapshot.queryParams[key] || '/home'
        this.router.navigate([returnUrl])
      }

    } else {
      this.router.navigate(['/login'])
    }
  }

  get expanded(): boolean {
    const expanded: string | null = window.sessionStorage.getItem('egp.app.menu.expanded')
    if (!!expanded === true) {
      return expanded === 'true'
    }

    window.sessionStorage.setItem('egp.app.menu.expanded', this.startExpandedValue.toString())
    return this.startExpandedValue
  }
  set expanded(value: boolean) {
    window.sessionStorage.setItem('egp.app.menu.expanded', value.toString())
  }

  toggleExpanded(): void {
    const expanded = this.expanded
    this.expanded = !expanded
  }

}
