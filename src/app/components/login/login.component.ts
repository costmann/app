import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { AuthService } from 'src/app/services/auth.service'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  passwordFormControl = new FormControl('', [
    Validators.required,
  ])


  loginForm = new FormGroup({
    appname: new FormControl(environment.appName),
    username: new FormControl(''),
    password: this.passwordFormControl,
  });

  loginFailed = false
  loggingIn = false
  hide = true
  placeholder = ''

  canRecoveryPassword = false

  message$: Observable<string | undefined>

  constructor(public authService: AuthService, private router: Router) {

    this.message$ = this.authService.message.pipe(map(m => {
      this.loggingIn = false
      this.loginFailed = !!m
      return m
    }))
  }

  ngOnInit(): void {
    this.placeholder = 'utente'
  }

  onSubmit(): void {
    this.authService.resetMessage()
    this.loggingIn = true
    const { appname, username, password } = this.loginForm.value

    if (!!appname && !!username && !!password) {
      this.authService.signIn(appname, username, password)
    }
    
  }

  onPasswordLost(): void {
    this.router.navigate(['/password-reset'])
  }
}
