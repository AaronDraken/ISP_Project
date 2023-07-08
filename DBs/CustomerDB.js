const dbConfig = require('../config/DBConfig').dbConfig;
const dbConnection = require('./../DBConnections/DBConnections');
const AccountDB = require('./../DBs/AccountDB');
const {ObjectId, Db}=require("mongodb");

class CustomerDB {
  static async addCustomer(insertPayload){
      try {
          let date=new Date();
          let customerPayload= {
            name:insertPayload.name,
            email:insertPayload.email,
            contact:insertPayload.contact,
            password:insertPayload.password,
            createdAt:date.getFullYear() +'-' +(date.getMonth() + 1) +'-' +date.getDate()
          }

          let selectedCollection = await dbConnection(dbConfig.customerCollection);

          let result = await selectedCollection.insertOne(customerPayload);

          if (result.acknowledged) {
            let accountPayload = {
              cid: result.insertedId,
              accountNo: parseInt(Math.random() * 10000000000),
              name:insertPayload.name,
              email:insertPayload.email,
              contact:insertPayload.contact,
              password:insertPayload.password,
              accType:'user',
              createdAt:date.getFullYear() +'-' +(date.getMonth() + 1) +'-' +date.getDate(),
            };

            //creating an account
            let accountResult = await AccountDB.addAccount(accountPayload);
            return accountResult;

          } else {
            console.log('Cannot add customer.');
          }

      } catch (error) {
          console.log(error);
      }
  }

  //to 'get' all customers info
  static async getAllCustomers() {
    let selectedCollection = await dbConnection(dbConfig.customerCollection);
    let result = await selectedCollection.find({}).toArray();
    return result;
  }

  //to check for a perticular customer
  static async authenticateCustomer(criteria) {
    let selectedCollection = await dbConnection(dbConfig.customerCollection);
    let result = await selectedCollection.findOne(criteria);
    return result;
  }

  static async customerById(criteria) {
    let selectedCollection = await dbConnection(dbConfig.customerCollection);
    let result = await selectedCollection.findOne({"_id":ObjectId(criteria.cid)});
    return result;
  }
}

module.exports = CustomerDB;