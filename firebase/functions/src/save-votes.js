const getTimestamp = require('./utils/timestamp');

module.exports = (db, firestore) => {
  const { arrayUnion } = firestore.FieldValue;

  return (request, response) => {
    // Get userId and votes array from POST body, and santize data
    let userId, votes;
    try {
      const data = JSON.parse(request.body);
      userId = data.userId.replace(/[^a-zA-Z0-9]/g, '');
      votes = data.votes.map(vote => {
        return {
          mammal: vote.mammalId.replace(/[^a-z-]/g, ''),
          voteDate: getTimestamp(firestore, vote.voteDate),
          wouldDrink: !!vote.wouldDrink,
        };
      });
    } catch (err) {
      return sendError(response, 'Invalid request:' + err);
    }

    const userDoc = db.collection('users').doc(userId);
    votes.forEach(vote => {
      console.log('adding vote', vote);
      userDoc.update({
        mammalVotes: arrayUnion(vote),
      });
    });

    sendSuccess(response, 'thanks!');
  };
};

function sendSuccess(response, message) {
  return response.send(JSON.stringify({ success: message }));
}

function sendError(response, message) {
  return response.send(JSON.stringify({ error: message }));
}
