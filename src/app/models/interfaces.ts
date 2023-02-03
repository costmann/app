export interface IRecyclingType {
  id: number
  name: string
}

export interface ILaboratory {
  id: number
  name: string
  logoFileName: string,
  deletedAt: Date | null
}

export interface IWasteForm {
  id: number
  number: string
  formDate: Date
  authority: string
  producer: string
  plant: string
  consignee: string
  district: string
  hauler: string
  regId: number
  samplingDate: Date
  ewc: string
  quantity: number
  schedule: ISchedule | null
}

export interface ISchedule {
  id: number
  recyclingTypeId: number
  recyclingTypeName: string
  laboratoryId: number
  laboratoryName: string
  scheduledDate: Date
  compiling: Boolean
  confirmed: Boolean
}

export interface IAnalysisData {
  id: number
  wasteFormid: number
  number: string
  formDate: Date
  authority: string
  producer: string
  plant: string
  consignee: string
  district: string
  samplingDate: Date
  ewc: string
  quantity: number
  scheduledDate: Date
  recyclingTypeName: string
  recyclingTypeTemplateId: number
  recyclingTypeClassName: string
  laboratoryName: string
  compiling: boolean
  confirmed: boolean
  confirmedAt: Date | null
  sent: boolean
  reportNumber: string
  analysisDate: Date | null
  area: string
}

export interface ISheet {
  id: number
  json: string

  number: string
  formDate: Date
  authority: string
  producer: string
  plant: string
  consignee: string
  district: string
  hauler: string
  ewc: string
  samplingDate: Date
  quantity: number
  scheduledDate: Date
  recyclingTypeName: string
  recyclingTypeTemplateId: number
  recyclingTypeClassName: string
  laboratoryName: string

  confirmed: boolean
  sent: boolean
  modifiedAt: Date | null
  notes: number
}

export interface IConfirmationResponse {
  id: number
  sendEmail: boolean
  confirmed: boolean
  sent: boolean
}

export interface INote {
  id: number
  description: string
  originalFileName: string
  storedlFileName: string
  createdBy: string
  createdAt: Date
}

export interface IAddNote {
  id: number
  description: string
  file: File | undefined
}

export interface IRole {
  id: number
  description: string
  isAdmin: boolean
  isManager: boolean
  isAnalyst: boolean
  isReader: boolean
  isAuthority: boolean
}

export interface IUser {
  userName: string
  role: IRole
  laboratory: ILaboratory | undefined
}

export interface IPicture {
  fileName: string
  base64Image: string
}

export interface IArea {
  id: number
  name: string
  deletedAt: Date | null
}
