import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './Home';
import Metrics from './Metrics';
import Profile from './Profile';
import { firebase } from './lib/firebase';
import './global.css';
import { api } from './lib/api';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      userId: null,
      mammals: [],
    };
    this.getMammals = this.getMammals.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.updateMammalsWithUserVotes = this.updateMammalsWithUserVotes.bind(
      this
    );
  }

  componentDidMount() {
    const getMammalsInitially = this.getMammals();
    // Bind sign-in state
    let isInitialState = true;
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      this.setState({
        isSignedIn: !!user,
        userId: (user && user.uid) || null,
      });
      // App started up
      if (isInitialState) {
        // User still logged in from prior session
        if (user) {
          getMammalsInitially.then(this.updateMammalsWithUserVotes);
        }
        // Anonymous user
        else {
        }
      } else {
        // User logged in
        if (user) {
          // Save user data
          api.saveUserData(user).then(() => {
            // Save any votes that this user has made anonymously
            api.sendVotes(user.uid).then(() => {
              // Update mammals on screen to reflect any prior votes
              getMammalsInitially.then(this.updateMammalsWithUserVotes);
            });
          });
        }
        // User logged out
        else {
          // Reset all votes on mammals
          getMammalsInitially.then(() => {
            this.setState({
              mammals: this.state.mammals.map(mammal => {
                delete mammal.vote;
                return mammal;
              }),
            });
          });
        }
      }
      isInitialState = false;

      // Make debugging easier
      window.currentUser = user;
    });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  getMammals() {
    return api
      .getMammals()
      .then(mammals => {
        this.setState({ mammals });
        // Make debugging easier
        window.mammals = mammals;
      })
      .catch(error => {
        console.log('Unable to fetch mammals!', error);
      });
  }

  handleVote(mammal, wouldDrink) {
    console.log('Voted for mammal', mammal.id, wouldDrink);
    const vote = {
      wouldDrink,
      voteDate: Date.now(),
      mammalId: mammal.id,
    };
    this.setState({
      mammals: this.state.mammals.map(thisMammal => {
        if (thisMammal === mammal) {
          thisMammal.vote = vote;
        }
        return thisMammal;
      }),
    });
    api.recordVote(this.state.userId, vote);
  }

  updateMammalsWithUserVotes() {
    // Fetch the user's votes and update swipeable mammals
    api.getUserVotes(this.state.userId).then(votes => {
      const voteMap = votes.reduce((obj, vote) => {
        obj[vote.mammalId] = vote;
        return obj;
      }, {});
      this.setState({
        mammals: this.state.mammals.map(mammal => {
          if (voteMap.hasOwnProperty(mammal.id)) {
            mammal.vote = voteMap[mammal.id];
          }
          return mammal;
        }),
      });
    });
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props => (
            <Home
              {...props}
              isSignedIn={this.state.isSignedIn}
              userId={this.state.userId}
              mammals={this.state.mammals}
              handleVote={this.handleVote}
            />
          )}
        />
        <Route
          exact
          path="/metrics/"
          render={props => (
            <Metrics {...props} isSignedIn={this.state.isSignedIn} />
          )}
        />
        <Route
          exact
          path="/profile/"
          render={props => (
            <Profile {...props} isSignedIn={this.state.isSignedIn} />
          )}
        />
      </Switch>
    );
  }
}

export default App;
