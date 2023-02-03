import { Analysis, Field, GlassAnalysis } from 'src/app/models/analysis-classes';
import { Observable, of } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { IAnalysis } from 'src/app/models/analysis-interfaces';
import { TemplatesService } from 'src/app/services/templates.service';

@Component({
  selector: 'app-glass-v01',
  templateUrl: './glass-v01.component.html',
  styleUrls: ['./glass-v01.component.scss']
})
export class GlassV01Component {

  analysis = new GlassAnalysis(Analysis.Empty)

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
  date: Field | undefined

  showFields = false

  formatDate(date: Date) {
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

  constructor(activatedRoute: ActivatedRoute, templatesService: TemplatesService) {
    activatedRoute.data.subscribe(
      {next: data => {

        this.analysis = new GlassAnalysis(data['analysis'] as IAnalysis)

        this.wCols = Array(this.analysis.samples).fill(1).map((x,i) => `Pesata \n ${i+1}`)

        this.authority = this.analysis.getField('authority')
        this.flow = this.analysis.getField('flow')
        this.plant = this.analysis.getField('plant')
        this.date = this.analysis.getField('date')

        if (!!this.authority) {
          if (!!this.authority.dataSource) {
            this.authorities$ = templatesService.getTable(this.authority.dataSource)
          }
        }

        if (!!this.flow) {
          if (!!this.flow.dataSource) {
            this.flows$ = templatesService.getTable(this.flow.dataSource)
          }
        }

        if (!!this.plant) {
          if (!!this.plant.dataSource) {
            this.plants$ = templatesService.getTable(this.plant.dataSource)
          }
        }

        if (!!this.date) {
          this.date.value = this.formatDate(new Date())
        }

        this.showFields = !!this.authority && !!this.flow && !!this.plant && !!this.date

        this.cols = Array(this.analysis.samples + 2 + this.sideCols).fill(1).map((x,i) => i);
        this.titleCols  = this.cols.length - this.sideCols - this.sideCols
      }}
    )
  }

}
