import { DbAddAccountUseCase } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/cryptografy/bcrypt-adapter'
import { MongoAccountRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export function makeSignUpController (): SignUpController {
  const emailValidator = new EmailValidatorAdapter()

  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new MongoAccountRepository()
  const addAccount = new DbAddAccountUseCase(encrypter, addAccountRepository)

  const signUpController = new SignUpController(emailValidator, addAccount)

  return signUpController
}