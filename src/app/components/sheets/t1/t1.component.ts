import { Component, Input, OnInit } from '@angular/core';
import { Field, GlassAnalysis } from 'src/app/models/analysis-classes';
import { Observable, of } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { IAnalysis } from 'src/app/models/analysis-interfaces';
import { ISheet } from 'src/app/models/interfaces';
import { TemplatesService } from 'src/app/services/templates.service';

@Component({
  selector: 'app-t1',
  templateUrl: './t1.component.html',
  styleUrls: ['./t1.component.scss'],
})
export class T1Component implements OnInit {

  @Input() scale = '100'
  _dataSheet!: ISheet

  coreAnalysis: IAnalysis = GlassAnalysis.Empty
  analysis = new GlassAnalysis(this.coreAnalysis)

  sideCols = 3
  cols = Array(this.analysis.samples + 2 + this.sideCols).fill(1).map((x,i) => i)
  titleCols = this.cols.length - this.sideCols - this.sideCols

  wCols = Array(this.analysis.samples).fill(1).map((x,i) => `Pesata \n ${i+1}`)

  authorities$: Observable<string[]> = of()
  flows$: Observable<string[]> = of()
  plants$: Observable<string[]> = of()

  authority: Field | undefined
  flow: Field | undefined
  plant: Field | undefined
  // date: Field | undefined

  showFields = false

  @Input() readonly = false

  formatDate(date: Date): string {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
  }

  constructor(private templatesService: TemplatesService, private authService: AuthService) {
    this.authority = this.analysis.getField('authority')
    this.flow = this.analysis.getField('flow')
    this.plant = this.analysis.getField('plant')
  }

  ngOnInit(): void {
    // if (this.dataSheet.confirmed && !this.revision) {
    //   this.analysis.disable()
    // }

    if (this.readonly) {
      this.analysis.disable()
    }

  }

  get dataSheet(): ISheet {
    return this._dataSheet
  }
  @Input() set dataSheet(value: ISheet) {
    this._dataSheet = value
    this.update()
  }

  setValue(fieldName: string, value: string | number | Date | undefined) {
    const f = this.analysis.getField(fieldName)
    if (!!f) {
      f.value = value
    }
  }

  update(): void {
    if (!!this.dataSheet.json) {
      const data = JSON.parse(this.dataSheet.json) as IAnalysis
      this.createSheet(data)
    } else {
      this.templatesService.getTemplateSheet(this.dataSheet.recyclingTypeClassName).subscribe({
        next: data => {
          this.createSheet(data, true)
        }
      })
    }
  }

  createSheet(data: IAnalysis, initialize = false) {

    this.coreAnalysis = data

    this.analysis = new GlassAnalysis(this.coreAnalysis)

    this.authority = this.analysis.getField('authority')
    this.flow = this.analysis.getField('flow')
    this.plant = this.analysis.getField('plant')
    // this.date = this.analysis.getField('date')

    this.analysis.fields?.forEach(f => {
      if (!!f.dataSource) {
        f.items = this.templatesService.getTable(f.dataSource)
      }
    })

    this.showFields = !!this.authority && !!this.flow && !!this.plant

    this.wCols = Array(this.analysis.samples).fill(1).map((x,i) => `Pesata \n ${i+1}`)

    this.cols = Array(this.analysis.samples + 2 + this.sideCols).fill(1).map((x,i) => i);
    this.titleCols  = this.cols.length - this.sideCols - this.sideCols

    if (initialize) {
      this.setValue('authority', this.dataSheet.authority)
      this.setValue('flow', this.dataSheet.number)
      this.setValue('plant', this.dataSheet.plant)
      // this.setValue('date', this.formatDate(this.dataSheet.scheduledDate))

      this.analysis.reportNumber.value = ''
      this.analysis.analysisDate.value = this.formatDate(this.dataSheet.scheduledDate)

    }

    if (this.readonly) {
      this.analysis.disable()
    }

  }

  save(): IAnalysis {
    this.analysis.save(this.coreAnalysis)
    return this.coreAnalysis
  }

}
