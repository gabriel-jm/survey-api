import { AccountModel } from '@/domain/models/account'
import { DbAuthenticationUseCase } from './db-authentication'

const accountModelFake = <AccountModel> {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
}

const tokenFake = 'any_token'

function makeSut () {
  const loadAccountByEmailRepositoryStub = {
    loadByEmail: jest.fn(
      () => Promise.resolve(accountModelFake)
    ) as jest.Mock<Promise<AccountModel| null>>
  }

  const hashComparerStub = {
    compare: jest.fn(() => Promise.resolve(true))
  }

  const encrypterStub = {
    encrypt: jest.fn(() => Promise.resolve(tokenFake))
  }

  const updateAccessTokenRepositoryStub = {
    updateAccessToken: jest.fn(() => Promise.resolve())
  }

  const sut = new DbAuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('Database Authentication use case', () => {
  const authModel = {
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    await sut.auth(authModel)

    expect(loadAccountByEmailRepositoryStub.loadByEmail)
      .toHaveBeenCalledWith(authModel.email)
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    loadAccountByEmailRepositoryStub.loadByEmail.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.auth(authModel)

    await expect(promise).rejects.toThrowError(Error)
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    loadAccountByEmailRepositoryStub.loadByEmail.mockResolvedValueOnce(null)

    const accessToken = await sut.auth(authModel)

    expect(accessToken).toBeNull()
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    await sut.auth(authModel)

    expect(hashComparerStub.compare)
      .toHaveBeenCalledWith(authModel.password, accountModelFake.password)
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    hashComparerStub.compare.mockImplementationOnce(() => {
      throw new Error()
    })

    await expect(sut.auth(authModel)).rejects.toThrowError(Error)
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    hashComparerStub.compare.mockResolvedValueOnce(false)

    const accessToken = await sut.auth(authModel)

    expect(accessToken).toBeNull()
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()

    await sut.auth(authModel)

    expect(encrypterStub.encrypt).toHaveBeenCalledWith(accountModelFake.id)
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    encrypterStub.encrypt.mockImplementationOnce(() => {
      throw new Error()
    })

    await expect(sut.auth(authModel)).rejects.toThrowError(Error)
  })

  it('should return access token on success', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(authModel)

    expect(accessToken).toBe(tokenFake)
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    await sut.auth(authModel)

    expect(updateAccessTokenRepositoryStub.updateAccessToken)
      .toHaveBeenCalledWith(accountModelFake.id, tokenFake)
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    updateAccessTokenRepositoryStub.updateAccessToken.mockImplementationOnce(() => {
      throw new Error()
    })

    await expect(sut.auth(authModel)).rejects.toThrowError(Error)
  })
})