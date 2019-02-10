module.exports = getTimestamp;

function getTimestamp(firestore, jsTimestamp) {
  const { Timestamp } = firestore;
  jsTimestamp = parseInt(jsTimestamp);
  return jsTimestamp ? Timestamp.fromMillis(jsTimestamp) : Timestamp.now();
}
