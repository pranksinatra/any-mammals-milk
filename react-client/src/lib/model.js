import { valueOf } from 'microstates';
import { setLocalUser, getAnonymousUserId } from './local';

export class Model {
  user = User;
  mammals = [Mammal];
}

export class User {
  id = String;
  displayName = String;
  email = String;
  photoURL = String;
  votes = [Vote];

  addVote(vote) {
    const userWithVote = this.votes.push(vote);
    setLocalUser(valueOf(userWithVote));
    return userWithVote;
  }

  /**
   * Update user upon app startup, login or logout
   * @param {object/null} user
   * @param {array} votes
   */
  update(user, votes = valueOf(this.votes)) {
    user = user || {};
    const { displayName = '', email = '', photoURL = '' } = user;
    const newUserData = {
      id: user.uid || user.id || getAnonymousUserId(),
      displayName,
      email,
      photoURL,
      votes,
    };
    setLocalUser(newUserData);
    return this.set(newUserData);
  }
  get isAnonymous() {
    const id = valueOf(this.id);
    return !id || id.startsWith('anonymous_');
  }
}

export class Mammal {
  id = String;
  name = String;
  image = Image;
}

export class Vote {
  wouldDrink = Boolean;
  voteDate = String;
  mammalId = String;
}

export class Image {
  width = Number;
  height = Number;
  src = String;
}

//
// Potential bugs to report
//
// - initialize() on Model, User, or Mammals all result in max call stack exceeded
