import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const xAccessToken = httpRequest.headers?.['x-access-token']

    if (xAccessToken) {
      await this.loadAccountByToken.load(xAccessToken)
    }

    return forbidden(new AccessDeniedError())
  }
}
