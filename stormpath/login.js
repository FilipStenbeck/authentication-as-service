'use strict';
var stormpath = require('stormpath');
const config = require('./config');
const printUserInfo = require('./printUserInfo');
let it;

function getApplication() {
  let apiKey = new stormpath.ApiKey(
    config.STORMPATH_CLIENT_APIKEY_ID,
    config.STORMPATH_CLIENT_APIKEY_SECRET
  );
  let client = new stormpath.Client({ apiKey: apiKey });

  client.getApplication(config.STORMPATH_APPLICATION_HREF, (err, application) => {
    if (err) {
      it.next(err);
    }
    return it.next(application);
  });
};

function authenticateUser(app, username, password) {
  let authRequest = {
    username,
    password
  };

  app.authenticateAccount(authRequest, (err, result) => {
    //Wrong username or password
    if (err) {
      if (err) {
        return it.next(err);
      }
    }
    return it.next(result);
  });
};

function* login(username, password) {
  try {
    let app = yield getApplication();
    let loginAttempt = yield authenticateUser(app, username, password);

    //User is not authenticated
    if (loginAttempt.status === 400) {
      console.log('messege to users', loginAttempt.userMessage);
      //console.log('message to our log', loginAttempt.developerMessage, 'username:', username);
      return;
    }

    //User is authenticated
    printUserInfo(loginAttempt);

  } catch (error) {
    console.log(error.stack);
  }
}

it = login('filip', 'Minst8tecken');
it.next();
