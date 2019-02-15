const firebase = require('firebase-admin');

function getTimestamp(jsTimestamp) {
  const { Timestamp } = firebase.firestore;
  jsTimestamp = parseInt(jsTimestamp);
  return jsTimestamp ? Timestamp.fromMillis(jsTimestamp) : Timestamp.now();
}

module.exports = getTimestamp;
