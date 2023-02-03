import { Component, Input, OnInit } from '@angular/core';

import { Analysis } from 'src/app/models/analysis-classes';
import { AuthService } from 'src/app/services/auth.service';
import { IAnalysis } from 'src/app/models/analysis-interfaces';
import { ISheet } from 'src/app/models/interfaces';
import { TemplatesService } from 'src/app/services/templates.service';

@Component({
  selector: 'app-t2',
  templateUrl: './t2.component.html',
  styleUrls: ['./t2.component.scss']
})
export class T2Component implements OnInit {

  @Input() scale = '100'
  _dataSheet!: ISheet

  // reportNumber = new FormControl()
  // analysisDate = new FormControl(new Date())

  showSignatures = false

  coreAnalysis: IAnalysis = Analysis.Empty
  analysis = new Analysis(this.coreAnalysis)

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

  constructor(private templatesService: TemplatesService, private authService: AuthService) { }

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

    this.analysis = new Analysis(this.coreAnalysis)

    if (this.analysis.signatures.length === 2) {
      this.showSignatures = true
    }

    this.analysis.fields?.forEach(f => {
      if (!!f.dataSource) {
        f.items = this.templatesService.getTable(f.dataSource)
      }
    })

    if (initialize) {

      this.analysis.reportNumber.value = ''
      this.analysis.analysisDate.value = this.formatDate(this.dataSheet.scheduledDate)

      this.setValue('authority', this.dataSheet.authority)
      this.setValue('district', this.dataSheet.district)
      this.setValue('formNumber', this.dataSheet.number)
      this.setValue('ewc', this.dataSheet.ewc)
      this.setValue('containerType', '')
      this.setValue('producer', this.dataSheet.producer)
      this.setValue('samplingDate', this.formatDate(this.dataSheet.samplingDate))
      this.setValue('hauler', this.dataSheet.hauler)
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
