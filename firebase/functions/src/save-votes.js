const Validator = require('fastest-validator');
const getTimestamp = require('./utils/timestamp');
const { arrayUnion } = require('firebase-admin').firestore.FieldValue;

module.exports = db => {
  const validate = new Validator().compile({
    userId: { type: 'string', pattern: /[a-zA-Z0-9_]+/ },
    votes: {
      type: 'array',
      min: 1,
      items: {
        type: 'object',
        props: {
          mammalId: { type: 'string', alphadash: true },
          voteDate: { type: 'number', integer: true, min: 1550213506537 },
          wouldDrink: { type: 'boolean' },
        },
      },
    },
    $$strict: true,
  });

  return (req, res) => {
    // Get user data from POST body, and validate it
    let postData = req.body;

    // If Beacon API was used, post data will be a string that needs parsed as JSON
    if (typeof postData === 'string') {
      try {
        postData = JSON.parse(postData);
      } catch (error) {
        console.error('Unable to parse save-votes POST body as JSON string');
      }
    }

    const validationResult = validate(postData);
    if (validationResult !== true) {
      return sendError(validationResult);
    }
    const { userId, votes } = postData;
    votes.forEach(vote => {
      vote.voteDate = getTimestamp(vote.voteDate);
    });

    const userDoc = db.collection('users').doc(userId);

    return Promise.all([
      userDoc.set({ lastUpdated: getTimestamp() }, { merge: true }),
      ...votes.map(vote =>
        userDoc.set({ mammalVotes: arrayUnion(vote) }, { merge: true })
      ),
    ]).then(sendSuccess, sendError);

    function sendSuccess() {
      return res.send({
        success: `Saved ${votes.length} vote${votes.length === 1 ? '' : 's'}`,
      });
    }

    function sendError(message) {
      console.error('Error:', message, { postData });
      return res.status(500).send(JSON.stringify({ error: message }));
    }
  };
};
