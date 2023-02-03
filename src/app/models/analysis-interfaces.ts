export interface IInstruction {
  pos: number | undefined
  code: string
  description: string
  type: string
  value: number | undefined
  percentage: number | undefined
}

export interface IArrayInput extends IInstruction {
  values: any[] //(number | undefined)[]
  hidePercentage: boolean
}

export interface IFraction extends IInstruction {
  parent: string
  limit: number
}

export interface ISum extends IInstruction {
  highlighted: boolean
  addends: string[]
}

export interface ISubtraction extends IInstruction {
  minuend: string
  subtrahend: string
}

export interface IField {
  id: string
  label: string
  type: 'text' | 'number' | 'date'
  value: string | Date | number | undefined
  readonly: boolean
  dataSource: string | undefined
}

export interface ISignature {
  description: string
  maxSignatures: 1| 2 | undefined
  signature1: string
  signature2: string
}

export interface IResult {
  text: string
  value: number | undefined
}

export interface IAnalysis {
  name: string
  version: string
  samples: number
  method: string
  reportNumber: IField
  analysisDate: IField
  fields: IField[]
  instructions: IInstruction[]
  signatures: ISignature[]
  total: ISum | undefined
  result: IResult | undefined
}

