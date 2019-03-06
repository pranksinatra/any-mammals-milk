const Validator = require('fastest-validator');

module.exports = db => {
  const validate = new Validator().compile({
    id: { type: 'string', alphadash: true },
    name: { type: 'string' },
    image: {
      type: 'object',
      props: {
        src: { type: 'string' },
        width: { type: 'number', integer: true },
        height: { type: 'number', integer: true },
      },
    },
    $$strict: true,
  });

  return (req, res) => {
    return db
      .collection('mammals')
      .get()
      .then(querySnapshot => {
        const mammals = [];
        const errors = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const { name, image } = data;
          // console.log(doc.id, data.name);
          mammals.push({ id: doc.id, name, image });
        });
        // Only pass valid mammals back to client, along with list of invalid ones
        return {
          mammals: mammals.filter(mammal => {
            const validationResult = validate(mammal);
            if (validationResult === true) {
              return true;
            } else {
              errors.push({ mammal, validationResult });
              return false;
            }
          }),
          errors,
        };
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
