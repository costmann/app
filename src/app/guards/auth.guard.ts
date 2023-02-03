import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!!this.authService.getToken()) {

      const roles = route.data['roles'] as string[]
      const user = this.authService.userValue
      return roles.filter(x => user!.roles.indexOf(x) !== -1).length > 0

    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
    return false
  }
}

