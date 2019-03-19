module.exports = db => {
  return (req, res) => {
    return db
      .collection('users')
      .get()
      .then(querySnapshot => {
        // MammalId => [ wouldDrinkCount, wouldNotDrinkCount ]
        const voteCounts = {};
        querySnapshot.forEach(doc => {
          const { mammalVotes = [] } = doc.data();
          mammalVotes.forEach(({ mammalId, wouldDrink }) => {
            if (!voteCounts[mammalId]) {
              voteCounts[mammalId] = [0, 0];
            }
            if (wouldDrink) {
              voteCounts[mammalId][0]++;
            } else {
              voteCounts[mammalId][1]++;
            }
          });
        });
        return voteCounts;
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
