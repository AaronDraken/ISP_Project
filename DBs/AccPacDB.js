const dbConfig = require('./../config/DBConfig').dbConfig;
const dbConnection = require('./../DBConnections/DBConnections');
const {ObjectId} = require("mongodb");

class accPacCollection{
    static async updateAccPac(updatePayload) {
        const selectedCollection = await dbConnection(dbConfig.accPacCollection);
        let result = await selectedCollection.updateOne({cid:ObjectId(updatePayload.cid)},{$set:{pid:ObjectId(updatePayload.pid)}},{upsert:true});
        return result;
    }

    static async getAllAccPac() {
        let selectedCollection = await dbConnection(dbConfig.accPacCollection);
        let result = await selectedCollection.find({}).toArray();
        return result;
    }

    static async pacById(criteria) {
        let selectedCollection = await dbConnection(dbConfig.accPacCollection);
        let result = await selectedCollection.findOne({"cid":ObjectId(criteria.cid)});
        return result;
    }
}

module.exports = accPacCollection;