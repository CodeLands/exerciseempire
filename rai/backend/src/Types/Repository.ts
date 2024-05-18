import { FailedDB } from "/App/Services/DbGateway"

export type RepositorySuccess<T> = {
    success: true,
    data: T
  }
  
export type RepositiryResult<T> = FailedDB | RepositorySuccess<T>