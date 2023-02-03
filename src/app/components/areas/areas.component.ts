import { Component, OnInit } from '@angular/core';

import { AddAreaDialogComponent } from '../dialogs/add-area-dialog/add-area-dialog.component';
import { AreasDataSource } from 'src/app/services/areas.datasource';
import { AreasService } from 'src/app/services/areas.service';
import { DeleteAreaDialogComponent } from '../dialogs/delete-area-dialog/delete-area-dialog.component';
import { IArea } from './../../models/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {


  displayedColumns = [ "name", "deleteOrRestore" ]

  dataSource: AreasDataSource

  canAdd = true

  constructor(session: SessionService, private areasService: AreasService, public dialog: MatDialog) {
    session.init();

    this.dataSource = new AreasDataSource(areasService)
  }

  ngOnInit(): void {
    this.dataSource.loadData()
  }

  addDialog(): void {

    const dialogRef = this.dialog.open(AddAreaDialogComponent, {
      width: '500px',
      data: {action: 'add', title: 'AGGIUNGI AREA', element: null}
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.loadData()
      }
    })

  }

  editDialog(area: IArea): void {

    const dialogRef = this.dialog.open(AddAreaDialogComponent, {
      width: '500px',
      data: {action: 'edit', title: 'MODIFICA', element: area}
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.loadData()
      }
    })

  }

  deleteDialog(area: IArea): void {
    const dialogRef = this.dialog.open(DeleteAreaDialogComponent, {
      width: '500px',
      data: area
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.areasService.delete(area.id).subscribe({
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

  restore(area: IArea): void {

    this.areasService.restore(area.id).subscribe({
      next: () => {
        this.dataSource.loadData()
      },
      error: (e) => {
        console.log(e.error)
      }
    })

  }

}
