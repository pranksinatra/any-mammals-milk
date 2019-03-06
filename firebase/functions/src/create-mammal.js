module.exports = db => {
  return (req, res) => {
    // Get user data from POST body, and validate it
    const postData = req.body;

    const mammalId = postData.id;
    const mammal = postData;
    delete mammal.id;

    // Create or update associated user document
    const mammalDoc = db.collection('mammals').doc(mammalId);

    return mammalDoc.set(mammal).then(sendSuccess, sendError);

    // return Promise.all([userDoc.update({})]).then(sendSuccess, sendError);

    function sendSuccess() {
      return res.send({ success: 'Created mammal' });
    }

    function sendError(message) {
      console.error('Error:', message, { postData });
      return res.status(500).send(JSON.stringify({ error: message }));
    }
  };
};
