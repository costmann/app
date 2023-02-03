import { Component, OnInit } from '@angular/core';

import { AddLaboratoryDialogComponent } from '../dialogs/add-laboratory-dialog/add-laboratory-dialog.component';
import { DeleteLaboratoryDialogComponent } from '../dialogs/delete-laboratory-dialog/delete-laboratory-dialog.component';
import { ILaboratory } from 'src/app/models/interfaces';
import { LaboratoriesDataSource } from 'src/app/services/laboratories.datasource';
import { LaboratoriesService } from 'src/app/services/laboratories.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-laboratories',
  templateUrl: './laboratories.component.html',
  styleUrls: ['./laboratories.component.scss']
})
export class LaboratoriesComponent implements OnInit {

  dataSource: LaboratoriesDataSource

  displayedColumns = [ "name", "changeLogo", "deleteOrRestore" ]

  canAdd = true

  constructor(session: SessionService, private laboratoriesService: LaboratoriesService, public dialog: MatDialog) {
    session.init();

    this.dataSource = new LaboratoriesDataSource(laboratoriesService)
  }

  ngOnInit(): void {
    this.dataSource.loadData()
  }

  addDialog(): void {

    const dialogRef = this.dialog.open(AddLaboratoryDialogComponent, {
      width: '500px',
      data: {action: 'add', title: 'AGGIUNGI LABORATORIO', element: null}
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.loadData()
      }
    })

  }

  changeLogoDialog(laboratory: ILaboratory): void {

    const dialogRef = this.dialog.open(AddLaboratoryDialogComponent, {
      width: '500px',
      data: {action: 'logo', title: 'CAMBIA LOGO', element: laboratory}
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.loadData()
      }
    })

  }

  editDialog(laboratory: ILaboratory): void {

    const dialogRef = this.dialog.open(AddLaboratoryDialogComponent, {
      width: '500px',
      data: {action: 'edit', title: 'MODIFICA', element: laboratory}
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.loadData()
      }
    })


  }

  deleteDialog(laboratory: ILaboratory): void {
    const dialogRef = this.dialog.open(DeleteLaboratoryDialogComponent, {
      width: '500px',
      data: laboratory
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.laboratoriesService.delete(laboratory.id).subscribe({
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

  restore(laboratory: ILaboratory): void {

    this.laboratoriesService.restore(laboratory.id).subscribe({
      next: () => {
        this.dataSource.loadData()
      },
      error: (e) => {
        console.log(e.error)
      }
    })

  }




}
