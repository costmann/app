import { IAnalysis, IArrayInput, IField, IFraction, IInstruction, IResult, ISignature, ISubtraction, ISum } from './analysis-interfaces';
import { Observable, of } from 'rxjs';

import { FormControl } from "@angular/forms"

const sum = (accumulator: number, currentValue:number) => accumulator + currentValue

export class Field {
  private _id: string
  private _label: string
  private _dataSource: string | undefined
  private _readonly: boolean
  private _type: 'text' | 'number' | 'date'
  private _formControl: FormControl

  public items: Observable<string[]> = of()

  constructor(field: IField) {
    this._id = field.id
    this._label = field.label
    this._dataSource = field.dataSource
    this._formControl = new FormControl(field.value)
    this._readonly = field.readonly || false
    this._type = field.type || 'text'
  }

  public get id(): string {
    return this._id
  }

  public get label(): string {
    return this._label
  }

  public get type(): 'text' | 'number' | 'date' {
    return this._type
  }

  public get dataSource(): string | undefined {
    return this._dataSource
  }

  public get value(): string | number | Date | undefined {
    return this._formControl.value
  }

  public set value(value: string | number | Date | undefined) {
    if (this._readonly === false) {
      this._formControl.setValue(value)
    }
  }

  public get formControl(): FormControl {
    return this._formControl
  }

  public get readonly(): boolean {
    return this._readonly
  }

  public save(a: IAnalysis): void {
    const field = a.fields.find(f => f.id === this.id)
    if (!!field) {
      field.value = this.value
    }
  }

  public dirty(): boolean {
    return this.formControl.dirty
  }
  public disable(): void {
    this.formControl.disable()
  }

  public markAsPristine(): void {
    this.formControl.markAsPristine()
  }
}

export class Signature {
  private _description: string
  private _maxSignatures: 1 | 2
  private _formControl1: FormControl
  private _formControl2: FormControl

  constructor(signature: ISignature) {
    this._description = signature.description
    this._maxSignatures = signature.maxSignatures || 1
    this._formControl1 = new FormControl(signature.signature1)
    this._formControl2 = new FormControl(signature.signature2)
  }

  public get description(): string {
    return this._description
  }

  public get maxSignatures(): 1 | 2 {
    return this._maxSignatures
  }

  public get signature1(): string {
    return this._formControl1.value
  }

  public set signature1(value: string) {
    this._formControl1.setValue(value)
  }

  public get signature2(): string {
    return this._formControl2.value
  }

  public set signature2(value: string) {
    this._formControl2.setValue(value)
  }

  public get Signature1(): FormControl {
    return this._formControl1
  }
  public get Signature2(): FormControl {
    return this._formControl2
  }

  public save(a: IAnalysis): void {
    const item = a.signatures.find(s => s.description === this.description)
    if (!!item) {
      item.signature1 = this.signature1
      item.signature2 = this.signature2
    }
  }

  public dirty(): boolean {
    return this._formControl1.dirty || this._formControl2.dirty
  }

  public disable(): void {
    this._formControl1.disable()
    this._formControl2.disable()
  }

  public markAsPristine(): void {
    this._formControl1.markAsPristine()
    this._formControl2.markAsPristine()
  }
}

export abstract class Item {
  private _analysis: Analysis
  private _pos: number
  private _code: string
  private _description: string
  private _highlighted: boolean
  public formControls: FormControl[] = []

  constructor(analysis: Analysis, pos: number | undefined, code: string, description: string, highlighted = false) {
    this._analysis = analysis
    this._pos = pos || 0
    this._code = code
    this._description = description
    this._highlighted = highlighted
  }

  public get analysis(): Analysis {
    return this._analysis
  }

  public get pos(): number {
    return this._pos
  }

  public get code(): string {
    return this._code
  }

  public get description(): string {
    return this._description
  }

  public get highlighted(): boolean {
    return this._highlighted
  }

  public get visible(): boolean {
    return (!!this._description === true)
  }

  public get ofWhich(): boolean {
    return (!!this._code) && (this._code.length === 2) && (/\d/.test(this._code[1]) === true)
  }

  public abstract get value(): number | undefined

  public get Value(): number {
    return (this.value || 0)
  }

  public get percentage(): number | undefined {
    return ((this.value || 0) * 100) / this.analysis.totalValue
  }

  public get formControl(): FormControl | undefined {
    if (this.formControls.length > 0) {
      return this.formControls[0]
    }
    return undefined
  }

  public dirty(): boolean {
    return (this.formControls.findIndex(c => c.dirty) > -1)
  }

  public disable(): void {
    this.formControls.forEach(c => c.disable())
  }

  public markAsPristine(): void {
    this.formControls.forEach(c => c.markAsPristine())
  }

  public save(a: IAnalysis): void {
    const item = a.instructions.find(i => i.pos === this.pos)
    if (!!item) {
      const i = item as unknown as IInstruction
      i.value = this.value
      i.percentage = this.percentage
    }
  }
}

export class TestItem extends Item {
  constructor(analysis: Analysis, pos: number | undefined, code: string, description: string) {
    super(analysis, pos, code, description, false)

    this.formControls.push(new FormControl())
  }

  public get value(): number | undefined {
    return this.formControls[0].value
  }

  public set value(v: number | undefined ) {
    this.formControls[0].setValue(v)
  }
}

export class InputItem extends Item {

  constructor(analysis: Analysis, pos: number | undefined, code: string, description: string) {
    super(analysis, pos, code, description, false)

    for (let i = 0; i < analysis.samples; i++) {
      this.formControls.push(new FormControl())
    }

  }

  public get values(): any[] {
    return this.formControls.map(i => i.value)
  }

  public set values(values: any[]) {
    const limit = Math.min(this.formControls.length, this.values.length)
    for (let i = 0; i < limit; i++) {
      this.formControls[i].setValue(values[i])
    }
  }

  public getValue(i: number): number | undefined {
    if ((i >= 0) && (i < this.formControls.length)) {
      return this.formControls[i].value
    }
    return undefined
  }

  public setValue(i: number, value: number | undefined): void {
    if ((i >= 0) && (i < this.formControls.length)) {
      this.formControls[i].setValue(value)
    }
  }

  public get value(): number {
    return this.formControls.map(i => (i.value || 0)).reduce(sum)
  }

  public override save(a: IAnalysis): void {
    const values = this.formControls.map(c => {return c.value})
    const item = a.instructions.find(i => i.pos === this.pos)
    if (!!item) {
      const i = item as unknown as IArrayInput
      i.values = values
      i.value = this.value
      i.percentage = this.percentage
    }
  }

}

export class SumItem extends Item  {
  args: Item[]
  constructor(analysis: Analysis, pos: number | undefined, code: string, description: string, highlighted: boolean, ...args: Item[]) {
    super(analysis, pos, code, description, highlighted)
    this.args = args
  }

  public get value(): number | undefined {
    if (this.args.length > 0) {
      return this.args.map(i => i.Value).reduce(sum)
    }
    return undefined
  }
}

export class SubtractionItem extends Item {
  private item1: Item
  private item2: Item

  constructor(pos: number | undefined, code: string, description: string, item1: Item, item2: Item) {
    super(item1.analysis, pos, code, description)
    this.item1 = item1
    this.item2 = item2
  }

  public get value(): number | undefined {
    return this.item1.Value - this.item2.Value
  }

}

export class FractionItem extends Item {
  private item: Item
  private limit: number

  constructor(pos: number | undefined, code: string, description: string, item: Item, limit: number) {
    super(item.analysis, pos, code, description)
    this.item = item
    this.limit = limit
  }

  public get value(): number | undefined {
    if (!!this.item.percentage) {
      return (this.item.analysis.totalValue * Math.min(this.item.percentage, this.limit)) / 100
    }
    return undefined
  }

}

export class Result  {
  private _text: string
  private _value: number | undefined

  constructor(text: string, value: number | undefined) {
    this._text = text
    this._value = value
  }

  public get text(): string {
    return this._text
  }

  public get value(): number | undefined {
    return this._value
  }
}

export class EmptyAnalysis implements IAnalysis {
  name = ''
  version = ''
  samples = 1
  method = ''
  reportNumber: IField = {id: 'reportNumber', label: 'N° Report', type: 'text', readonly: false, dataSource: '', value: ''}
  analysisDate: IField = {id: 'analysisDate', label: 'Data Analisi', type: 'date', readonly: false, dataSource: '', value: ''}
  fields: IField[] = []
  instructions: IInstruction[] = []
  signatures: ISignature[] = []
  total: ISum | undefined
  result: IResult | undefined
}

export class EmptyGlassAnalysis implements IAnalysis {
  name = ''
  version = ''
  samples = 15
  method = ''
  reportNumber: IField = {id: 'reportNumber', label: 'N° Report', type: 'text', readonly: false, dataSource: '', value: ''}
  analysisDate: IField = {id: 'analysisDate', label: 'Data Analisi', type: 'date', readonly: false, dataSource: '', value: ''}
  fields: IField[] = [
    {id: 'authority', label: 'Ente gestore', type: 'text', readonly: true, dataSource: '', value: ''},
    {id: 'flow', label: 'Flusso di Raccolta', type: 'text', readonly: true, dataSource: '', value: ''},
    {id: 'plant', label: 'Analisi eseguita presso \n l\'impianto', type: 'text', readonly: true, dataSource: '', value: ''},
    {id: 'date', label: 'Data', type: 'date', readonly: true, dataSource: '', value: ''},
  ]
  instructions: IInstruction[] = []
  signatures: ISignature[] = []
  total: ISum | undefined
  result: IResult | undefined
}

export class Analysis {

  public static Empty = new EmptyAnalysis()

  private _name = ''
  private _version = ''
  private _samples = 1
  private _method = ''
  private _fields: Field[] = []
  private _signatures: Signature[] = []
  private _items: Item[] = []
  private _total: SumItem | undefined

  public reportNumber: Field
  public analysisDate: Field

  protected getItems(...args: string[]): Item[] {
    const retval: Item[] = []
    args.map(c => this._items.find(i => i.code === c)).forEach(element => {
      if (!!element === true) {
        retval.push(element!)
      }
    });
    return retval
  }

  protected getItem(code: string): Item | undefined {
    return this._items.find(i => i.code === code)
  }

  constructor(analysis: IAnalysis) {
    this._name = analysis.name
    this._version = analysis.version
    this._samples = analysis.samples
    this._method = analysis.method

    this.reportNumber = new Field(analysis.reportNumber)
    this.analysisDate = new Field(analysis.analysisDate)

    analysis.fields.forEach(e => {
      this._fields.push(new Field(e))
    })

    analysis.instructions.forEach(e => {
      switch (e.type) {
        case "input": {
          if (this.samples > 1) {
            const i = e as unknown as IArrayInput
            const item = new InputItem(this, i.pos, i.code, i.description)
            if (!!i.values) {
              item.values = i.values
            }
            this._items.push(item)
          } else {
            const i = e as unknown as IInstruction
            const item = new TestItem(this, i.pos, i.code, i.description)
            item.value = i.value
            this._items.push(item)
          }
          break
        }

        case "sum": {
          const i = e as unknown as ISum
          const item = new SumItem(this, i.pos, i.code, i.description, i.highlighted, ...this.getItems(...i.addends))
          this._items.push(item)
          break
        }

        case "fraction": {
          const i = e as unknown as IFraction
          const item = this.getItem(i.parent)
          if (!!item === true) {
            this._items.push(new FractionItem(i.pos, i.code, i.description, item!, i.limit))
          }
          break
        }

        case "subtraction": {
          const i = e as unknown as ISubtraction
          const m = this.getItem(i.minuend)
          const s = this.getItem(i.subtrahend)
          if ((!!m === true) && (!!s === true)) {
            this._items.push(new SubtractionItem(i.pos, i.code, i.description, m!, s!))
          }
          break
        }

        default : {
          break
        }
      }
    })

    analysis.signatures.forEach(e => {
      this._signatures.push(new Signature(e))
    })

    if (!!analysis.total) {
      this._total = new SumItem(this, 0, analysis.total.code, analysis.total.description, analysis.total.highlighted, ...this.getItems(...analysis.total.addends))
    }

  }

  public get name(): string {
    return this._name
  }

  public get version(): string {
    return this._version
  }

  public get samples(): number {
    return this._samples
  }

  public get method(): string {
    return this._method
  }

  public getField(id: string): Field | undefined {
    return this._fields.find(i => i.id === id)
  }

  public get fields(): Field[] {
    return this._fields
  }

  public get signatures(): Signature[] {
    return this._signatures
  }

  public get total(): SumItem | undefined {
    return this._total
  }

  public get items(): Item[] {
    return this._items.filter(i => i.pos > 0).sort((a, b) => (a.pos > b.pos) ? 1 : ((b.pos > a.pos) ? -1 : 0))
  }

  public get totalValue(): number {
    if (!!this._total) {
      return this._total.Value
    }
    return 0
  }

  public get result(): Result {
    return new Result('', undefined)
  }

  public save(a: IAnalysis): void {

    a.reportNumber.value = this.reportNumber.value
    a.analysisDate.value = this.analysisDate.value

    this.fields.forEach(f => {
      f.save(a)
    })

    this.signatures.forEach(s => {
      s.save(a)
    })

    this.items.forEach(i => {
      i.save(a)
    })

    if (!!this.total && !!a.total) {
      a.total.value = this.total.value
      a.total.percentage = this.total.percentage
    }

    this.markAsPristine()
  }

  public dirty(): boolean {
    return this.reportNumber.dirty()
      || this.analysisDate.dirty()
      || this.fields.some(f => f.dirty())
      || this.signatures.some(s => s.dirty())
      || this.items.some(i => i.dirty())
  }

  public disable(): void {
    this.reportNumber.disable()
    this.analysisDate.disable()
    this.fields.forEach(f => f.disable())
    this.signatures.forEach(s => s.disable())
    this.items.forEach(i => i.disable())
  }

  public markAsPristine(): void {
    this.reportNumber.markAsPristine()
    this.analysisDate.markAsPristine()
    this.fields.forEach(f => f.markAsPristine())
    this.signatures.forEach(s => s.markAsPristine())
    this.items.forEach(i => i.markAsPristine())
  }

}

export class GlassAnalysis extends Analysis {

  public static override Empty = new EmptyGlassAnalysis()

  public override get result(): Result {
    if (this.totalValue > 0) {
      const d = this.getItem('D')
      const j = this.getItem('J')
      const c = this.getItem('C')

      if (!!d && !!j && !!c && d.percentage && j.percentage && c.percentage) {

        let text = 'NC'

        if (d.percentage <= 0.3 && j.percentage <= 1) {
          text = 'A'
        } else {

          if (d.percentage <= 0.4 && j.percentage <= 2) {
            text = 'B'
          } else {
            if (d.percentage <= 0.5 &&j.percentage <= 3) {
              text = 'C'
            } else {
              if (d.percentage <= 0.8 && j.percentage <= 4) {
                text = 'D'
              } else {
                if (d.percentage <= 1.5 && j.percentage <= 6.5) {
                  text = 'E'
                }
              }
            }
          }
        }

        let value: number | undefined

        if (c.percentage <= 15) {
          value = 1
        } else {
          if (c.percentage > 15 && c.percentage <= 20) {
            value = 0.7
          } else {
            if (c.percentage > 20 && c.percentage <= 25) {
              value = 0.4
            } else {
              if (c.percentage > 25 && c.percentage <= 45) {
                value = 0
              }  else {
                //? cella Y22 non c'è nulla retval.percentage = ?
              }
            }
          }
        }

        return new Result(text, value)
      }
    }

    return super.result
  }


  public override save(a: IAnalysis): void {

    a.reportNumber.value = this.reportNumber.value
    a.analysisDate.value = this.analysisDate.value

    this.fields.forEach(f => {
      f.save(a)
    })

    this.signatures.forEach(s => {
      s.save(a)
    })

    this.items.forEach(i => {
      i.save(a)
    })

    if (!!a.result) {
      a.result.text = this.result.text
      a.result.value = this.result.value
    }

    this.markAsPristine()
  }

}
