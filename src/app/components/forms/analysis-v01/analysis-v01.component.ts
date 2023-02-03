import { ActivatedRoute } from '@angular/router';
import { Analysis } from 'src/app/models/analysis-classes';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IAnalysis } from 'src/app/models/analysis-interfaces';
import { TemplatesService } from 'src/app/services/templates.service';

@Component({
  selector: 'app-analysis-v01',
  templateUrl: './analysis-v01.component.html',
  styleUrls: ['./analysis-v01.component.scss']
})
export class AnalysisV01Component {

  reportNumber = new FormControl()
  analysisDate = new FormControl(new Date())

  showSignatures = false

  analysis = new Analysis(Analysis.Empty)

  constructor(activatedRoute: ActivatedRoute, public templatesService: TemplatesService) {
    activatedRoute.data.subscribe({
      next: data => {
        this.analysis = new Analysis(data['analysis'] as IAnalysis)
        this.analysis.fields?.forEach(f => {
          if (!!f.dataSource) {
            f.items = templatesService.getTable(f.dataSource)
          }
        })
        if (this.analysis.signatures.length === 2) {
          this.showSignatures = true
        }
      }
    })
  }

}
