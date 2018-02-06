const images = [
  '/images/mammal-1.jpg',
  '/images/mammal-2.jpg',
  '/images/mammal-3.jpg',
  '/images/mammal-4.jpg',
  '/images/mammal-5.jpg',
];

const imageElem = document.getElementById('mammal-image');
imageElem.src = images[0];

let mammalIndex = 0;

const yesBtn = document.getElementById('btn-yes'),
  noBtn = document.getElementById('btn-no');

yesBtn.addEventListener('click', () => answerQuestion(true));
noBtn.addEventListener('click', () => answerQuestion(false));

function answerQuestion(isYes) {
  yesBtn.disabled = noBtn.disabled = true;

  // fake id
  const mammalId = mammalIndex + 1;

  recordVote(mammalId, isYes, data => {
    
    if ( data.success ) {
      console.log('Recorded vote', mammalId, isYes);
    }
    else {
      console.error('Failed to record vote', mammalId, isYes, data);
    }

    mammalIndex = mammalIndex + 1 === images.length ? 0 : mammalIndex + 1;
    imageElem.src = images[mammalIndex];

    yesBtn.disabled = noBtn.disabled = false;

  });
}

function recordVote(mammalId, isYes, callback) {
  const url = 'http://api.micahjon.com/any-mammals-milk/vote.php',
    data = '?data=' + JSON.stringify({ 
      userId: window.userId,
      votes: [{ mammalId: mammalId, vote: isYes ? 1 : -1 }]
    });

  getJSON(url + data, callback);
}

function getJSON(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      var data = JSON.parse(this.response);
      callback(data);

    } else {
      // We reached our target server, but it returned an error
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
}

//--

window.addEventListener('load', function() {

  // Keep track of whether user logged in
  var isLoggedIn = false;

  // Accessible globally as auth0.webAuth
  var webAuth = new auth0.WebAuth({
    domain: 'any-mammals-milk.auth0.com',
    clientID: '8kL5tAS66BwF7gphZQURQwwGR720ofy5',
    responseType: 'token id_token',
    audience: 'https://any-mammals-milk.auth0.com/userinfo',
    scope: 'openid',
    redirectUri: window.location.href
  });

  var loginBtn = document.getElementById('btn-login');
    // logoutBtn = document.getElementById('btn-logout');

  // Login when user clicks button
  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();

    if ( window.location.host.startsWith('localhost') ) {
      isLoggedIn = true;
      window.userId = 'test-user|' + Math.round(Math.random() * 1000000);
      updateLoginButton();
      return;
    }
    
    webAuth.authorize();

  });

  // logoutBtn.addEventListener('click', function(e) {
  //   e.preventDefault();
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('id_token');
  //   localStorage.removeItem('expires_at');
  //   updateLoginButton(true);
  // });

  // After login redirects user to page, remove hash and connect to API 
  // to get user data
  handleAuthentication();

  function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';

        window.userId = authResult.idTokenPayload.sub;

        // setSession(authResult);
        isLoggedIn = true;
      } 
      // Show login button
      else {
        isLoggedIn = false;
        if (err) {
          console.log(err);
          alert('Error: ' + err.error + '. Check the console for further details.');
        }
      }
      updateLoginButton();
    });
  }

  // function setSession(authResult) {
  //   // Set the time that the access token will expire at
  //   var expiresAt = JSON.stringify(
  //     authResult.expiresIn * 1000 + new Date().getTime()
  //     );
  //   localStorage.setItem('access_token', authResult.accessToken);
  //   localStorage.setItem('id_token', authResult.idToken);
  //   localStorage.setItem('expires_at', expiresAt);
  // }

  function updateLoginButton() {
    if ( isLoggedIn ) {
      loginBtn.classList.add('d-none');
      // logoutBtn.classList.remove('d-none');
      yesBtn.classList.remove('d-none');
      noBtn.classList.remove('d-none');
    }
    else {
      loginBtn.classList.remove('d-none');
      // logoutBtn.classList.add('d-none');
      yesBtn.classList.add('d-none');
      noBtn.classList.add('d-none');
    }
  }

}); 


  //------------------------

  // // ...
  // var loginStatus = document.querySelector('.container h4');
  // var loginView = document.getElementById('login-view');
  // var homeView = document.getElementById('home-view');

  // // buttons and event listeners
  // var homeViewBtn = document.getElementById('btn-home-view');
  // var loginBtn = document.getElementById('btn-login');
  // var logoutBtn = document.getElementById('btn-logout');

  // homeViewBtn.addEventListener('click', function() {
  //   homeView.style.display = 'inline-block';
  //   loginView.style.display = 'none';
  // });

  // logoutBtn.addEventListener('click', logout);

  // function handleAuthentication() {
  //   webAuth.parseHash(function(err, authResult) {
  //     if (authResult && authResult.accessToken && authResult.idToken) {
  //       window.location.hash = '';
  //       setSession(authResult);
  //       loginBtn.style.display = 'none';
  //       homeView.style.display = 'inline-block';
  //     } else if (err) {
  //       homeView.style.display = 'inline-block';
  //       console.log(err);
  //       alert(
  //         'Error: ' + err.error + '. Check the console for further details.'
  //         );
  //     }
  //     displayButtons();
  //   });
  // }

  // function setSession(authResult) {
  //   // Set the time that the access token will expire at
  //   var expiresAt = JSON.stringify(
  //     authResult.expiresIn * 1000 + new Date().getTime()
  //     );
  //   localStorage.setItem('access_token', authResult.accessToken);
  //   localStorage.setItem('id_token', authResult.idToken);
  //   localStorage.setItem('expires_at', expiresAt);
  // }

  // function logout() {
  //   // Remove tokens and expiry time from localStorage
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('id_token');
  //   localStorage.removeItem('expires_at');
  //   displayButtons();
  // }

  // function isAuthenticated() {
  //   // Check whether the current time is past the
  //   // access token's expiry time
  //   var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  //   return new Date().getTime() < expiresAt;
  // }

  // function displayButtons() {
  //   if (isAuthenticated()) {
  //     loginBtn.style.display = 'none';
  //     logoutBtn.style.display = 'inline-block';
  //     loginStatus.innerHTML = 'You are logged in!';
  //   } else {
  //     loginBtn.style.display = 'inline-block';
  //     logoutBtn.style.display = 'none';
  //     loginStatus.innerHTML =
  //     'You are not logged in! Please log in to continue.';
  //   }
  // }

