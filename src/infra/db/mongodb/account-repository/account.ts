import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class MongoAccountRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountsCollection = MongoHelper.getCollection('accounts')
    const operationResult = await accountsCollection.insertOne(accountData)

    const [{ _id, ...accountWithoutId }] = operationResult.ops
    const account = {
      id: _id,
      ...accountWithoutId
    }

    return account
  }
}