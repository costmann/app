import { Component, OnInit } from '@angular/core';
import { IArea, IUser } from './../../models/interfaces';

import { AddUserDialogComponent } from '../dialogs/add-user-dialog/add-user-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { DeleteUserDialogComponent } from '../dialogs/delete-user-dialog/delete-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from 'src/app/services/session.service';
import { UsersDataSource } from 'src/app/services/users.datasource';
import { UsersService } from './../../services/users.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  canAdd = true

  dataSource: UsersDataSource

  displayedColumns = ["icon", "userName", "roleDescription", "laboratoryName", "areas", "delete" ]

  constructor(session: SessionService, private usersService: UsersService, private authService: AuthService, public dialog: MatDialog) {
    session.init();

    this.dataSource = new UsersDataSource(usersService)
  }
  ngOnInit(): void {
    this.dataSource.loadData()
  }

  addDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '500px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.loadData()
      }
    })

  }

  canDelete(user :IUser): boolean {
    return user.userName !== this.authService.userValue?.name
  }

  deleteDialog(user: IUser): void {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: '500px',
      data: user
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.deleteUser(user.userName).subscribe({
          next: () => {
            this.dataSource.loadData()
          },
          error: (e) => {
            console.log(e.error)
          }
        })
      }
    })

  }

  getAreaName(areas: IArea[]): string {
    return areas.map(a => a.name).join(', ')
  }

}
