const dbConfig = require('./../config/DBConfig').dbConfig;
const client = require('mongodb').MongoClient;
async function createConnection(collectionName) {
  try {
    let connectedObj = await client.connect(dbConfig.url);
    let dbObj = await connectedObj.db(dbConfig.dbName);
    let collection = await dbObj.collection(collectionName);
    return collection;
  } catch (error) {
    console.log(error);
  }
}

module.exports = createConnection;