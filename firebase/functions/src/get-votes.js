const Validator = require('fastest-validator');

module.exports = db => {
  const validate = new Validator().compile({
    userId: { type: 'string', alphanum: true },
    $$strict: true,
  });

  return (req, res) => {
    const postData = req.body;
    const validationResult = validate(postData);
    if (validationResult !== true) {
      return sendError(validationResult);
    }
    const { userId } = postData;
    return db
      .collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        // console.log('got mammal votes', doc.data().mammalVotes);
        return doc.data().mammalVotes.map(vote => {
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
