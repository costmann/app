import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IArea, IRecyclingType } from 'src/app/models/interfaces';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';

import { AuthService } from './../../services/auth.service';
import { ExportsService } from 'src/app/services/exports.service';
import { Roles } from './../../models/user';

@Component({
  selector: 'app-exports',
  templateUrl: './exports.component.html',
  styleUrls: ['./exports.component.scss']
})
export class ExportsComponent {
  areas$: Observable<IArea[]>
  types$: Observable<IRecyclingType[]>
  filteredDistricts$: Observable<string[]>

  form: FormGroup
  range: FormGroup

  districtControl: FormControl

  message = ''
  waiting = false
  isAuthority


  constructor(private exportsService: ExportsService, authService: AuthService) {

    this.isAuthority = authService.isInRole([Roles.authority])

    let saved = undefined
    const json = window.sessionStorage.getItem('ExportFilter')
    if (!!json) {
      saved  = JSON.parse(json)
    }

    this.districtControl = new FormControl(!!saved ? saved.district : '')

    this.areas$ = exportsService.getAreas()
    this.types$ = exportsService.getRecyclingTypes()

    this.filteredDistricts$ = this.districtControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => {
        if (!!value) {
          return exportsService.getDistricts(value)
        } else {
          return of([])
        }
      })
    )

    this.range = new FormGroup({
      start: new FormControl(!!saved ? saved.range.start : undefined),
      end: new FormControl(!!saved ? saved.range.end : undefined),
    })

    this.form = new FormGroup({
      area: new FormControl(!!saved ? saved.area : undefined),
      range: this.range,
      recyclingType: new FormControl(!!saved ? saved.recyclingType : []),
      district: this.districtControl,
    })
  }

  onSubmit(): void {

    this.waiting = true

    window.sessionStorage.setItem('ExportFilter', JSON.stringify(this.form.value))

    this.message = ''
    this.exportsService.export(this.form.value).subscribe({
      next: (response: HttpResponse<Blob>) => {
        if (!!response.body) {
          const contentDisposition = response.headers.get('content-disposition')
          let filename = 'export.xlsx'
          if (!!contentDisposition) {
            filename = contentDisposition.split(';')[1].split('=')[1].replace(/\"/g, '')
          }
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(response.body)
          link.download = filename
          link.click()
          this.waiting = false
        } else {
          console.log('Response body is null!')
          this.message = "Impossibile completare l'operatione!"
          this.waiting = false
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
        if (error.status === 404) {
          this.message = 'Nessuna analisi trovata!'
        } else {
          this.message = `Si è verificato un errore! [Codice: ${error.status}]`
        }
        this.waiting = false
      },
    })
  }
}
