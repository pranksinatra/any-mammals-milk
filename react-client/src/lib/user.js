import { firebase } from './firebase';

const getUser = () => firebase.auth().currentUser;

const getUserImage = () => {
  const user = getUser();
  return (user && user.photoURL) || '';
};

const getUserNickname = () => {
  const user = getUser();
  return (user && user.displayName) || '';
};

export { getUserImage, getUserNickname };
