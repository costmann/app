import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ])

  resetForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: this.emailFormControl
  });

  placeholder = ''
  sending = false
  sent = false
  message$: Observable<string | undefined>
  reset$: Observable<boolean>

  constructor(public authService: AuthService, private router: Router) {
    this.message$ = this.authService.message.pipe(map(m => {
      this.sending = false
      return m
    }))

    this.reset$ = this.authService.done.pipe(map(r => {
      this.sent = true
      return r
    }))
  }

  ngOnInit(): void {
    // if (!!environment.domain) {
    //   this.placeholder = `${environment.domain}\\username`
    // }
    this.placeholder = 'utente'
  }

  onSubmit(): void {
    this.authService.resetMessage()
    this.sending = true
    this.sent = false
    const { username, email } = this.resetForm.value

    if (!!username && !!email) {
      this.authService.resetPassword(username, email)
    } 
  }

  onClick(): void {
    this.router.navigate(['/login'])
  }

}
