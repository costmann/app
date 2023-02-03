export interface WasteForm {
  id: number
  number: string
  formDate: Date
  authority: string
  producer: string
  plant: string
  consignee: string
  district: string
  regId: number
  samplingDate: Date
  ewc: string
  quantity: number
}

export interface RecyclingType {
  id: number
  name: string
  templateId: number
  className: string
}

export interface Laboratory {
  id: number
  name: string
}

export interface Analysis {
  id: number
  wasteForm: WasteForm
  recyclingType: RecyclingType
  laboratory: Laboratory
  scheduledDate: Date
  compiledAt: Date | null
  confirmedAt: Date | null
  jsonContent: string
}
