import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms'

import { AuthService } from 'src/app/services/auth.service'
import { Component } from '@angular/core'
import { ErrorStateMatcher } from '@angular/material/core'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { map } from 'rxjs/operators'
import { newPasswordValidator } from 'src/app/validators/new-password.directive'

export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return !!control && !!control.parent && control.parent.invalid && (control.dirty || control.touched);
  }
}

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {

  confirmValidParentMatcher = new ConfirmValidParentMatcher()

  oldPasswordFormControl = new FormControl('', [
    Validators.required,
  ])

  newPasswordFormControl = new FormControl('', [
    Validators.required,
  ])

  confirmNewPasswordFormControl = new FormControl('', [
    Validators.required,
  ])

  changePasswordForm = new FormGroup({
    'oldPassword': this.oldPasswordFormControl,
    'newPassword': this.newPasswordFormControl,
    'confirmNewPassword': this.confirmNewPasswordFormControl,
  }, { validators: newPasswordValidator });

  changing = false
  changed = false
  failed = false

  hideOld = true
  hideNew = true
  hideConfirm = true

  message$: Observable<string | undefined>
  passwordChanged$: Observable<boolean>

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.message$ = this.authService.message.pipe(map(m => {
      this.changing = false
      this.failed = true
      return m
    }))

    this.passwordChanged$ = this.authService.done.pipe(map(r => {
      this.changed = true
      return r
    }))
  }


  get f(){
    return this.changePasswordForm.controls;
  }

  onSubmit(): void {
    this.authService.resetMessage()
    this.changing = true
    this.changed = false
    this.failed = false

    const { oldPassword, newPassword } = this.changePasswordForm.value

    if (!!oldPassword && !!newPassword) {
      this.authService.changePassword(oldPassword, newPassword)
    }
    
  }

  onClick(): void {
    this.router.navigate(['/'])
  }

}
