const Validator = require('fastest-validator');
const getTimestamp = require('./utils/timestamp');
const { arrayUnion } = require('firebase-admin').firestore.FieldValue;

module.exports = db => {
  const validate = new Validator().compile({
    userId: { type: 'string', alphanum: true },
    loginDate: { type: 'number', integer: true, min: 1550213506537 },
    displayName: { type: 'string', min: 2 },
    email: { type: 'email' },
    $$strict: true,
  });

  return (req, res) => {
    // Get user data from POST body, and validate it
    const postData = req.body;
    const validationResult = validate(postData);
    if (validationResult !== true) {
      return sendError(validationResult);
    }
    const { userId, displayName, email } = postData;
    const loginDate = getTimestamp(postData.loginDate);

    // Create or update associated user document
    const userDoc = db.collection('users').doc(userId);

    return userDoc
      .set(
        { displayName, email, loginDates: arrayUnion(loginDate) },
        { merge: true }
      )
      .then(sendSuccess, sendError);

    // return Promise.all([userDoc.update({})]).then(sendSuccess, sendError);

    function sendSuccess() {
      return res.send({ success: 'Saved user data' });
    }

    function sendError(message) {
      console.error('Error:', message, { postData });
      return res.status(500).send(JSON.stringify({ error: message }));
    }
  };
};
