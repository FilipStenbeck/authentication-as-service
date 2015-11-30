'use strict';
var stormpath = require('stormpath');
const config = require('./config');
let it;

function handleError(error) {
  console.log('error', error, error.stack);
  throw new Error(error);
}

let getApplication = function () {
  let apiKey = new stormpath.ApiKey(
    config.STORMPATH_CLIENT_APIKEY_ID,
    config.STORMPATH_CLIENT_APIKEY_SECRET
  );

  let client = new stormpath.Client({ apiKey: apiKey });
  let  applicationHref = config.STORMPATH_APPLICATION_HREF;

  client.getApplication(applicationHref, (err, application) => {
    if (err) {
      handleError(err);
    }
    return it.next(application);
  });
};

let resetPassword = function resetPassword(app, email) {
  app.sendPasswordResetEmail({email}, function (err, passwordResetToken) {
    // The token is the last part of the HREF.
    return it.next(passwordResetToken.href.split('/').pop());
  });
};


function* reset(email) {
  try {
    let app = yield getApplication();
    let result = yield resetPassword(app, email);
    console.log(result);
  } catch (error) {
    console.log(error.stack);
  }
}

it = reset('filip.stenbeck@besedo.com');
it.next();
