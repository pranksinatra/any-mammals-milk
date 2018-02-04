window.addEventListener('load', function() {

  var webAuth = new auth0.WebAuth({
    domain: 'any-mammals-milk.auth0.com',
    clientID: '8kL5tAS66BwF7gphZQURQwwGR720ofy5',
    responseType: 'token id_token',
    audience: 'https://any-mammals-milk.auth0.com/userinfo',
    scope: 'openid',
    redirectUri: window.location.href
  });

  var loginBtn = document.getElementById('btn-login');

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

});