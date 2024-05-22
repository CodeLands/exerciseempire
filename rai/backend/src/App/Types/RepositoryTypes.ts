export enum RepositoryResultStatus {
  success = "Success",
  failed = "Failed",
  dbError = "Database error!",
  zodError = "Invalid data from database!"
}

export type RepositorySuccess<T> = {
  status: RepositoryResultStatus.success,
  data: T
}

export type RepositoryFailed = {
  status: RepositoryResultStatus.failed,
  messages: string[]
}

export type RepositoryZodError = {
  status: RepositoryResultStatus.zodError,
  errors: string[]
}

export type RepositoryDBError = {
  status: RepositoryResultStatus.dbError
  errors: string[]
}
  
export type RepositoryResult<T> = RepositoryDBError | RepositoryZodError | RepositoryFailed | RepositorySuccess<T>