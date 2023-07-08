const dbConfig = {
    "url": "mongodb+srv://<user>:<pass>@isp.srvjiyv.mongodb.net/?retryWrites=true&w=majority",
    "dbName": "ISP",
    "customerCollection": "CustomerDB",
    "accountCollection": "AccountDB",
    "packageCollection":"PackageDB",
    "accPacCollection":"AccPacDB"
}

const portNumber = 3000

module.exports = { dbConfig, portNumber };