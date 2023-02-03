export interface ApiResult<T> {
  data: T[]
  pageIndex: number
  pageSize: number
  totalCount: number
  totalPages: number
  sortColumn: string
  sortOrder: string
  filterQuery: string
  startDate: Date | null
  endDate: Date | null
}
