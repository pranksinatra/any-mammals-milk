const Validator = require('fastest-validator');

module.exports = db => {
  const validate = new Validator().compile({
    userId: { type: 'string', alphanum: true },
    anonymousUserIdToDelete: {
      type: 'string',
      pattern: /anonymous_[a-zA-Z0-9_]+/,
      optional: true,
    },
    $$strict: true,
  });

  return (req, res) => {
    const postData = req.body;
    const validationResult = validate(postData);
    if (validationResult !== true) {
      return sendError(validationResult);
    }

    const { userId, anonymousUserIdToDelete } = postData;

    // Delete anonymous user (and continue execution regardless of whether this worked or not)
    if (anonymousUserIdToDelete) {
      db.collection('users')
        .doc(anonymousUserIdToDelete)
        .delete()
        .catch(error => {
          console.error('Unable to delete anonymous user', error);
        });
    }

    // Get votes from logged-in user (if they exist, this document might not even be created yet)
    return db
      .collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        // Note: doc.data() might be undefined if this is a new user and the
        // createUserOnLogin() function has not completed user creation
        const { mammalVotes = [] } = doc.data() || {};
        return mammalVotes.map(vote => {
          // Convert timestamp to milliseconds for JavaScript
          const timestamp = vote.voteDate;
          vote.voteDate =
            timestamp._seconds * 1e3 + timestamp._nanoseconds / 1e6;
          return vote;
        });
      })
      .then(sendResult, sendError);

    function sendResult(result) {
      return res.send(result);
    }

    function sendError(message) {
      console.error('Error:', message);
      return res.status(500).send(JSON.stringify({ error: message }));
    }
  };
};
