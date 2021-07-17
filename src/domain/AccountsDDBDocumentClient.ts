// import {  } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Account, Accounts, IdGenerator } from "..";
import { AccountImpl } from "./AccountImpl";

export class AccountsDDBDocumentClient implements Accounts {
  constructor(private ddb: DocumentClient, private nextId: IdGenerator) {}
  async get(id: string): Promise<Account> {
    const response = await this.ddb.get({
      TableName: "Accounts",
      Key: {
        AccountId: id
      }
    }).promise()

    if(!response.Item){
      throw new Error(`AccountNotFound: ${id}`)
    }
    const balance = response.Item?.Balance as number

    return new AccountImpl(id,balance)
  }

  async create(): Promise<Account> {
    const acc = new AccountImpl(this.nextId())
    await this.save(acc)
    return acc;
  }

  async save(...accounts: Account[]): Promise<void> {
    // Not suitable for production use, but makes cleaning up in tests unnecessary
    const TTL_SECONDS = 60
    const ttl = (new Date().getTime() / 1000) + TTL_SECONDS
    const saveRequests = accounts.map(acc => this.ddb.put({
      TableName: "Accounts",
      Item: {
        AccountId: acc.id,
        Balance: acc.balance
      }
    }).promise())
    await Promise.all(saveRequests)
  }
}
