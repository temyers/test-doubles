import AWSMock from "aws-sdk-mock";
import sinon from "sinon";
import AWS from "aws-sdk";
import { AccountImpl, Accounts } from "..";
import { AccountsDDB } from "./AccountsDDB";
import { expect } from "chai";

describe("AccountsDDB", () => {
  var accounts: Accounts;
  var createItemSpy: any;
  const idMock = sinon.mock().returns("12345")
  beforeEach(() => {
    createItemSpy = sinon.spy((params,callback) => {
      callback(null,{})
    });
    AWSMock.mock("DynamoDB", "putItem", createItemSpy);

    accounts = new AccountsDDB(new AWS.DynamoDB(), idMock);
  });

  afterEach( () => {
    AWSMock.restore();
  })

  describe("#create", () => {
    it("should create an account", async () => {
      // when
      await accounts.create();

      // then
      const expectedParams = {
        Item: {
          AccountId: {
            S: "12345",
          },
          Balance: {
            N: "0",
          },
        },
        TableName: "Accounts",
      };
      expect(createItemSpy.calledWith(expectedParams), "DynamoDB.putItem not called as expected").to.equal(true);
      expect(idMock.called, "IdGenerator not called").to.equal(true)
    });

    it("should save an account", async () => {
      // given
      const acc = new AccountImpl("22345", 400);

      // when
      await accounts.save(acc)

      const expectedParams = {
        Item: {
          AccountId: {
            S: "22345",
          },
          Balance: {
            N: "400",
          },
        },
        TableName: "Accounts",
      };
      expect(createItemSpy.calledWith(expectedParams), "DynamoDB.putItem not called as expected").to.equal(true);
    });
  });
});
