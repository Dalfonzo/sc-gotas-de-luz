export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, 403)
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409)
  }
}
