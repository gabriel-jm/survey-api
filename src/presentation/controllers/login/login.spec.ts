import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

function makeSut () {
  const sut = new LoginController()

  return {
    sut
  }
}

describe('', () => {
  // const httpRequest = {
  //   body: {
  //     email: 'any_email@mail.com',
  //     password: 'any_password'
  //   }
  // }

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        password: 'any_password'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
