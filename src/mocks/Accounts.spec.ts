import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk'
import { Accounts } from "..";
import { AccountsDDB } from './AccountsDDB';
import sinon from 'sinon'
import expect from 'expect'

describe("AccountsDDB", () => {
  var accounts: Accounts
  var createItemSpy:any;
  beforeEach( () => {
    createItemSpy = sinon.spy();
    AWSMock.mock('DynamoDB', 'putItem', createItemSpy);
    accounts = new AccountsDDB(new AWS.DynamoDB())
  })

  describe("#create", () => {
    it("should create an account", () => {
      // when
      accounts.create()


      // then
      const expectedParams = {
        
      }
      expect(createItemSpy.calledWith(expectedParams))
    })

    it("should save an account", () => {

    })
  })
})