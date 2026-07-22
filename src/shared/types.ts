export interface PaginationMeta {
  page: number
  limit: number
  total: number
}

export interface ListResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface SingleResponse<T> {
  data: T
}

export interface ErrorResponse {
  error: {
    code: string
    message: string
  }
}
