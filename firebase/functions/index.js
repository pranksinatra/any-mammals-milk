const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
  origin: true,
});

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// Function definitions
// const getMammals = require('./src/get-mammals');
// const createUpdateUser = require('./src/create-update-user');
const getVotes = require('./src/get-votes');
const saveVotes = require('./src/save-votes');
const createUserOnLogin = require('./src/create-user-on-login');
const countVotes = require('./src/count-votes');

// exports.getMammals = wrapFunction(getMammals);
// exports.createUpdateUser = wrapFunction(createUpdateUser);
exports.saveVotes = wrapFunction(saveVotes);
exports.getVotes = wrapFunction(getVotes);
exports.countVotes = wrapFunction(countVotes);

// Triggered upon Firebase authentication
exports.createUserOnLogin = functions.auth
  .user()
  .onCreate(user => createUserOnLogin(db, user));

function wrapFunction(fn) {
  return functions.https.onRequest((req, res) => {
    // @todo -> fix lack of response when invalid JSON is sent
    return cors(req, res, () => fn(db)(req, res));
  });
}
