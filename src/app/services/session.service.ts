import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  init(name: string = ''): void {

    if (name === 'analyses') {
      window.sessionStorage.removeItem('currentConsolidated')
      window.sessionStorage.removeItem('showConsolidatedNotes')
      return
    }

    if (name === 'consolidated') {
      window.sessionStorage.removeItem('currentAnalysis')
      window.sessionStorage.removeItem('showAnalysisNotes')
      return
    }

    window.sessionStorage.removeItem('currentConsolidated')
    window.sessionStorage.removeItem('currentAnalysis')
    window.sessionStorage.removeItem('showConsolidatedNotes')
    window.sessionStorage.removeItem('showAnalysisNotes')

    window.sessionStorage.removeItem('navigateTo')
  }
}
