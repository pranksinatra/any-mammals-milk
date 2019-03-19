const Validator = require('fastest-validator');
const getTimestamp = require('./utils/timestamp');

const validate = new Validator().compile({
  uid: { type: 'string', alphanum: true },
  displayName: { type: 'string', min: 2 },
  email: { type: 'email' },
});

/**
 * Create new user document when they login for the first time
 */
module.exports = (db, user) => {
  const validationResult = validate(user);
  if (validationResult !== true) {
    console.log(validationResult);
    throw new Error('Invalid user');
  }
  const { uid: id, displayName, email } = user;
  const loginTimestamp = getTimestamp();

  // Create user document
  return db
    .collection('users')
    .doc(id)
    .set({ displayName, email, loginDates: [loginTimestamp] });
};
