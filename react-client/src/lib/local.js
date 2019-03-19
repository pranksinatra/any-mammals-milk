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
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.log('Unable to write user to LocalStorage', error);
    }
    return false;
  }
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
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.log('Unable to get user from LocalStorage', error);
    }
  }
  return isValidUser(localUser) ? localUser : defaultUser;
}
