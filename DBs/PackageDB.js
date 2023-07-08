const dbConnection = require('./../DBConnections/DBConnections');
const dbConfig = require('./../config/DBConfig').dbConfig;
const {ObjectId} = require("mongodb");


class PackageDB{
    static async addPackage(insertPayload) {
        try {
            let packagePayload = {
                pname: insertPayload.pname,
                validity: insertPayload.validity,
                speed: insertPayload.speed,
                price: insertPayload.price,
            };

            let selectedCollection = await dbConnection(dbConfig.packageCollection);
            let result = await selectedCollection.insertOne(packagePayload);
            return result;

        } catch (error) {
            console.log(error);
        }
    }

    static async getAllPackages(){
        let selectedCollection = await dbConnection(dbConfig.packageCollection);
        let result = await selectedCollection.find({}).toArray();
        return result;
    }

    static async packageById(criteria) {
        let selectedCollection = await dbConnection(dbConfig.packageCollection);
        let result = await selectedCollection.findOne({"_id":ObjectId(criteria.pid)});
        return result;
    }

    static async deletePackage(deletePayload) {
        let selectedCollection = await dbConnection(dbConfig.packageCollection);
        let result = await selectedCollection.deleteOne({"_id":ObjectId(deletePayload.pid)});
        return result;
    }

    static async updatePackage(updatePayload) {
        let selectedCollection = await dbConnection(dbConfig.packageCollection);
        let result = await selectedCollection.updateOne({_id:ObjectId(updatePayload.pid)},{$set:{name:updatePayload.pname, speed:updatePayload.speed, validity:updatePayload.validity, price:updatePayload.price}});
        return result;
    }
}

module.exports = PackageDB;