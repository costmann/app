
export class Filter {

  constructor(sortColumn: string, sortDirection: string, column = '', filter = '', start: Date | null, end: Date | null, pageIndex = 0, pageSize = 10) {
    this.sortColumn = sortColumn
    this.sortDirection = sortDirection
    this.column = column
    this.filter = filter
    this.start = start
    this.end = end
    this.pageIndex = pageIndex
    this.pageSize = pageSize
  }

  public sortColumn = ''
  public sortDirection: string = 'asc'
  public column = ''
  public filter = ''
  public start: Date | null = null
  public end: Date | null = null
  public pageIndex = 0
  public pageSize = 10
}
