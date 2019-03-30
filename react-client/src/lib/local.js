import Lockr from 'lockr';

/**
 * Store user data in LocalStorage
 * @param {object} userData
 * @return {boolean} wasSuccessful
 */
export function setLocalUser(userData) {
  try {
    Lockr.set('user', userData);
    return true;
  } catch (error) {}
  return false;
}

/**
 * Get user data from LocalStorage
 * @return {object} localUser
 */
export function getLocalUser() {
  const isValidUser = user => user && Array.isArray(user.votes);
  const defaultUser = { votes: [] };
  let localUser;
  try {
    localUser = Lockr.get('user');
  } catch (error) {}

  const user = isValidUser(localUser) ? localUser : defaultUser;

  // Assign an anonymous user if it's missing
  // (we used to use no ID (empty string) for anonymous users)
  user.id = user.id || getAnonymousUserId();

  return user;
}

function setAnonymousUserId(id) {
  try {
    Lockr.set('anonymous_user_id', id);
    return true;
  } catch (error) {}
  return false;
}

export function getAnonymousUserId() {
  const prefix = 'anonymous_';
  let id;
  try {
    id = Lockr.get('anonymous_user_id');
  } catch (error) {}
  // Found valid anonymous user ID in LocalStorage
  if (typeof id === 'string' && id.startsWith(prefix)) {
    return id;
  }
  // Generate one
  id = prefix + randomID(15);
  setAnonymousUserId(id);
  return id;
}

/**
 * Generate random alphanumeric ID
 * @source https://stackoverflow.com/a/1349426/1546808
 * @param {number} length
 */
function randomID(length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
