import { Component, HostListener, ViewChild } from '@angular/core'
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav'
import { MenuItem, User } from './models/user'

import { AuthService } from './services/auth.service'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Observable } from 'rxjs'
import { SideMenuService } from './services/side-menu.service'
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Analisi Revet'

  desktopMode: boolean

  mode: MatDrawerMode = "side"
  opened: boolean = true
  disableClose: boolean = true
  hasBackdrop = false

  selectedItem: string[] = []

  user$: Observable<User | undefined>
  menu$: Observable<MenuItem | undefined>
  @ViewChild('sidenav') sidenav!: MatSidenav

  canChangePassword = false

  constructor(
    private authService: AuthService,
    public sidemenu: SideMenuService,
    private deviceService: DeviceDetectorService,
  )
  {

    this.user$ = authService.user

    this.menu$ = sidemenu.item.pipe(map((item) => {
      if (!!item.icon) {
        this.selectedItem = [item.path]
      } else {
        this.selectedItem = []
      }
      return item
    }))

    this.desktopMode = this.isDesktop()
    this.setDrawer()

  }

  getUserInfo(user: User): string {
    return 'Account: ' + user.name + '\n\n' + user.firstName + ' ' + user.lastName
  }

  signOut(): void {
    this.authService.signOut()
  }

  passwordChange(): void {
    setTimeout(() => {
      this.sidemenu.navigate(['/password-change'])

    }, 10)
  }

  onClick(item: MenuItem): void {
    this.sidemenu.navigate([item.path])
    if (this.desktopMode === false) {
      this.sidenav.close()
    }
  }

  toggleMenu(): void {

    if (this.desktopMode) {
      this.sidemenu.toggleExpanded()
    } else {
      if (this.sidenav.opened) {
        this.sidenav.close()
      } else {
        this.sidenav.open()
      }

    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const isDesktop = this.isDesktop()
    if (this.desktopMode != isDesktop) {
      this.desktopMode = isDesktop
      this.setDrawer()
    }
  }

  setDrawer(): void {
    this.opened = this.desktopMode
    this.mode = this.desktopMode ? 'side' : 'over'
    this.disableClose = this.desktopMode
    this.hasBackdrop = this.desktopMode === false
  }

  isDesktop(): boolean {
    return this.deviceService.isDesktop()
  }

}
