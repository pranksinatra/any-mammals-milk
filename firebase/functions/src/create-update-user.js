const Validator = require('fastest-validator');
const getTimestamp = require('./utils/timestamp');
const { arrayUnion } = require('firebase-admin').firestore.FieldValue;

/**
 * Create/update user and send back user data, including votes
 */
module.exports = db => {
  const validate = new Validator().compile({
    id: { type: 'string', alphanum: true },
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
    const { id, displayName, email, loginDate } = postData;
    const loginTimestamp = getTimestamp(loginDate);

    // Create or update associated user document
    const userDocRef = db.collection('users').doc(id);

    return userDocRef
      .set(
        { displayName, email, loginDates: arrayUnion(loginTimestamp) },
        { merge: true }
      )
      .then(() => userDocRef.get())
      .then(userDoc => {
        const { mammalVotes: votes = [] } = userDoc.data();

        // Convert timestamp to milliseconds for JavaScript
        votes.map(vote => {
          const timestamp = vote.voteDate;
          vote.voteDate =
            timestamp._seconds * 1e3 + timestamp._nanoseconds / 1e6;
          return vote;
        });

        // Send back original data plus votes
        return sendSuccess({ id, displayName, email, loginDate, votes });
      })
      .catch(sendError);

    function sendSuccess(user) {
      return res.send({ user });
    }

    function sendError(message) {
      console.error('Error:', message, { postData });
      return res.status(500).send(JSON.stringify({ error: message }));
    }
  };
};
