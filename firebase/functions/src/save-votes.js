const getTimestamp = require('./utils/timestamp');
const { arrayUnion } = require('firebase-admin').firestore.FieldValue;

module.exports = db => {
  return (request, response) => {
    // Get userId and votes array from POST body, and santize data
    let userId, votes;
    try {
      const data = JSON.parse(request.body);
      userId = data.userId.replace(/[^a-zA-Z0-9]/g, '');
      votes = data.votes.map(vote => {
        return {
          mammal: vote.mammalId.replace(/[^a-z-]/g, ''),
          voteDate: getTimestamp(vote.voteDate),
          wouldDrink: Boolean(vote.wouldDrink),
        };
      });
    } catch (err) {
      return sendError(response, 'Invalid request:' + err);
    }

    const userDoc = db.collection('users').doc(userId);
    Promise.all(
      votes.map(vote =>
        userDoc.update({
          mammalVotes: arrayUnion(vote),
        })
      )
    )
      .then(() => {
        return sendSuccess(response, `saved ${votes.length} votes`);
      })
      .catch(error => {
        console.error('Unable to save votes', error);
        return sendSuccess(response, error);
      });
  };
};

function sendSuccess(response, message) {
  return response.send(JSON.stringify({ success: message }));
}

function sendError(response, message) {
  return response.send(JSON.stringify({ error: message }));
}
