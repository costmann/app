import { Component, OnInit } from '@angular/core';
import { IArea, ILaboratory, IRole } from 'src/app/models/interfaces';

import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent {

  userName = ''
  role: IRole | undefined
  laboratory: ILaboratory | undefined
  areas: IArea[] | undefined

  laboratories$: Observable<ILaboratory[]>
  areas$: Observable<IArea[]>
  roles$: Observable<IRole[]>

  errorMessage = ''

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private usersService: UsersService)
  {
    this.laboratories$ = usersService.getLaboratories()
    this.areas$ = usersService.getAreas()
    this.roles$ = usersService.getRoles()
  }

  onRoleChange(): void {
    this.laboratory = undefined
    this.areas = undefined
  }

  isValid(): boolean {
    return !!this.userName && !!this.role && ((this.role.isAnalyst && !!this.laboratory) || (!this.role.isAnalyst))
  }

  save(): void {

    this.errorMessage = ''

    if (this.isValid()) {
      this.usersService.saveUser(this.userName, this.role!.id, this.laboratory?.id, this.areas).subscribe({
        next: () => {
          this.dialogRef.close(true)
        },
        error: (e) => {
          this.errorMessage = 'Si è verificato un errore'
        }
      })

    }
  }
}
