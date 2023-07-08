const express = require('express');
const AccountDB = require('./DBs/AccountDB');
const AccPacDB = require('./DBs/AccPacDB');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const CustomerDB = require('./DBs/CustomerDB');
const PackageDB = require('./DBs/PackageDB');
const portNumber = require('./config/DBConfig').portNumber;

app.get('/', (req, res, next) => {
  res.send('Welcome to AM Broadband Services');
});

app.post('/add', async (req, res, next) => {
  let resultObj = await CustomerDB.addCustomer(req.body);

  let responseObj = {};

  if (resultObj.acknowledged) {
    responseObj = { msg: 'Customer created successfuly', status: 200 };
  } else {
    responseObj = {
      msg: 'something went wrong, for more details, check server log',
      status: 500,
    };
  }
  res.send(responseObj);
});

app.get('/Home', async (req, res, next) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/Login', (req, res, next) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/allAccounts', async (req, res, next) => {
  res.send(await AccountDB.getAllAccounts());
});

app.post('/authenticate', async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let result;

  if (username != undefined && username.includes('@')) {
    result = await CustomerDB.authenticateCustomer({ email: username });
  } else {
    result = await CustomerDB.authenticateCustomer({ contact: username });
  }

  let details = { customer_details: result };
  if (result != null && result != undefined) {
    result = await AccountDB.accountByCustomerId({
      cid: result._id,
      password: password,
    });

    if (result != null && result != undefined) {
      details['account_details'] = result;
      details['msg'] = 'success';
    }
  }

  res.send(details);
});

app.get('/UserDashboard', async (req, res, next) => {
  res.sendFile(__dirname + '/public/user.html');
});

app.get('/details', async (req, res, next) => {
  let cid = req.query.cid;
  let result = await CustomerDB.customerById({ cid: cid });
  let details = { customer_details: result };
  if (result != null && result != undefined) {
    result = await AccountDB.accountByCustomerId({
      cid: result._id,
    });

    if (result != null && result != undefined) {
      details['account_details'] = result;
      // console.log('account details-----',result);
      details['msg'] = 'success';
      result = await AccPacDB.pacById({ cid: cid });
      // console.log("accpacdbresult", result);
      if (result != null && result != undefined) {
        result = await PackageDB.packageById({
          pid: result.pid,
        });
        details["pack_details"] = result;
      }
    }
  }
  res.send(details);
});

app.post('/updateAccount', async (req, res, next) => {
  let resultObj = await AccountDB.updateAccount(req.body);
  let responseObj = {};
  
  if (resultObj.acknowledged) {
    responseObj = { msg: 'Account Updated successfully', status: 200 };
  } else {
    responseObj = {
      msg: 'something went wrong, for more details, check server log',
      status: 500,
    }
  }
   res.send(responseObj);
});

//-------------------------------------------Package Codes ------------------------------------------
app.post('/addPackage', async (req, res, next) => {
  let resultObj = await PackageDB.addPackage(req.body);

  let responseObj = {};

  if (resultObj.acknowledged) {
    responseObj = { msg: 'Package added successfuly', status: 200 };
  } else {
    responseObj = {
      msg: 'something went wrong, for more details, check server log',
      status: 500,
    };
  }
  res.send(responseObj);
});

app.get('/allPackages', async (req, res, next) => {
  res.send(await PackageDB.getAllPackages());
});

app.get('/packageDetails', async (req, res, next) => {
  let pid = req.query.pid;
  let result = await PackageDB.packageById({ pid: pid });
  let details = { package_details: result };

  res.send(details);
});

app.post('/updatePackage', async (req, res, next) => {
  let resultObj = await PackageDB.updatePackage(req.body);
  let responseObj = {};
  
  if (resultObj.acknowledged) {
    responseObj = { msg: 'Package Updated successfully', status: 200 };
  } else {
    responseObj = {
      msg: 'something went wrong, for more details, check server log',
      status: 500,
    }
  }
   res.send(responseObj);
});

app.delete('/deletePackage', async (req, res, next)=>{
  let pid = req.query.pid;
  let resultObj = await PackageDB.deletePackage({ pid: pid });
  let responseObj = {};

  if (resultObj.acknowledged) {
    responseObj = { msg: 'Package Deleted successfully', status: 200 };
  } else {
    responseObj = {
      msg: 'something went wrong, for more details, check server log',
      status: 500,
    }
  }
   res.send(responseObj);
});

app.get('/pidByCID', async (req, res, next) => {
  let cid = req.query.cid;
  let result = await AccPacDB.pacById({ cid: cid });
  // console.log("accpacdbresult", result);
  if (result != null && result != undefined) {
    result = await PackageDB.packageById({
      pid: result.pid,
    });
  }
  // console.log("result from pidByCid", result);
  res.send(result);
})

app.post('/updateAccPac', async (req, res, next) => {
  let resultObj = await AccPacDB.updateAccPac(req.body);
  let responseObj = {};
  
  if (resultObj.acknowledged) {
    responseObj = { msg: 'AccPac Updated successfully', status: 200 };
  } else {
    responseObj = {
      msg: 'something went wrong, for more details, check server log',
      status: 500,
    }
  }
   res.send(responseObj);
});

//------------------------------------------------------------------------------------------------------
app.get('/AdminDashboard', (req, res, next) => {
  res.sendFile(__dirname + '/public/admin.html');
});

app.listen(portNumber, () => {
  console.log('server started on 3000');
});
