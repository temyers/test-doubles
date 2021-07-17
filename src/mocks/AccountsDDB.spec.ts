import AWSMock from "aws-sdk-mock";
import sinon from "sinon";
import AWS from "aws-sdk";
import { Accounts } from "..";
import { AccountsDDB } from "../domain/AccountsDDB";
import chai, { expect } from "chai";
import { AccountImpl } from "../domain/AccountImpl";

chai.use(require('sinon-chai'));


describe("AccountsDDB", () => {
  var accounts: Accounts;
  var createItemSpy: any;
  // Configure mock objects to return a canned response
  const idMock = sinon.mock().returns("12345");
  beforeEach(() => {
    createItemSpy = sinon.spy((params, callback) => {
      callback(null, {});
    });
    AWSMock.mock("DynamoDB", "putItem", createItemSpy);

    accounts = new AccountsDDB(new AWS.DynamoDB(), idMock);

  });

  afterEach(() => {
    AWSMock.restore();
  });

  describe("#create", () => {
    it("should create an account", async () => {
      // when
      const account = await accounts.create();

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

      expect(account.id).to.equal("12345");
      expect(account.balance).to.equal(0);

      // Assert expected behaviour interaction with mock objects
      expect(createItemSpy).to.have.been.calledWith(sinon.match(expectedParams))
      expect(idMock.called, "IdGenerator not called").to.equal(true);

      // Stubs are like mocks, but you don't need to verify interactions
    });
  });

  describe("#save", () => {
    it("should save an account", async () => {
      // given
      const acc = new AccountImpl("22345", 400);

      // when
      await accounts.save(acc);

      // Then
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
      expect(createItemSpy).to.have.been.calledWith(sinon.match(expectedParams))

    });

    it("should save multiple accounts", async () => {
      // given
      const acc1 = new AccountImpl("22345", 400);
      const acc2 = new AccountImpl("32345", 500);

      // when
      await accounts.save(acc1, acc2);

      //Then
      const expectedAcc1Save = {
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
      expect(createItemSpy).to.have.been.calledWith(sinon.match(expectedAcc1Save))

      const expectedAcc2Save = {
        Item: {
          AccountId: {
            S: "32345",
          },
          Balance: {
            N: "500",
          },
        },
        TableName: "Accounts",
      };
      expect(createItemSpy).to.have.been.calledWith(sinon.match(expectedAcc2Save))

    });
  });
});
