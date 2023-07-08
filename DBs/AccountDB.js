const dbConfig = require('./../config/DBConfig').dbConfig;
const { ObjectId } = require('mongodb');
const dbConnection = require('./../DBConnections/DBConnections');

class AccountDB {
    static async addAccount(insertPayload) {
        try {
            const selectedCollection = await dbConnection(dbConfig.accountCollection);
            const result = await selectedCollection.insertOne(insertPayload);  
            return result;
        } catch (error) {
            console.log(error);
        }
}

static async updateAccount(updatePayload) {
    let selectedCollection = await dbConnection(dbConfig.accountCollection);
    let result = await selectedCollection.updateOne({cid:ObjectId(updatePayload.cid)},{$set:{name:updatePayload.name, email:updatePayload.email, contact:updatePayload.contact}},{upsert:true});
    return result;
}

static async deleteAccount(deletePayload) {
    let selectedCollection = await dbConnection(dbConfig.accountCollection);
    let result = await selectedCollection.deleteOne({cid:ObjectId(deletePayload.cid)});
    return result;
}

static async getAllAccounts() {
    let selectedCollection = await dbConnection(dbConfig.accountCollection);
    let result = await selectedCollection.find({}).toArray();
    return result;
  }

   //get an account info customer id 
   static async accountByCustomerId(criteria) {
    let selectedCollection = await dbConnection(dbConfig.accountCollection);
    let result = await selectedCollection.findOne(criteria);
    return result;
   }
}

module.exports = AccountDB;