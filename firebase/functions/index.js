const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
  origin: true,
});

// Function definitions
const addUser = require('./src/add-user');
const saveVotes = require('./src/save-votes');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send('Hello from Firebase!');
// });

exports.addUser = wrapFunction(addUser);
exports.saveVotes = wrapFunction(saveVotes);

function wrapFunction(fn) {
  return functions.https.onRequest((req, res) => {
    // @todo -> fix lack of response when invalid JSON is sent
    return cors(req, res, () => fn(db)(req, res));
  });
}
