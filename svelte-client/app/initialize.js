/*
 * This is the entrypoint of all the JavaScript files.
 */

import Routes from './routes';

document.addEventListener('DOMContentLoaded', main);

function main () {
  console.log('v0.0.1');

  window.Routes = new Routes();
  
  // Resolve this promise when Auth0 library has loaded
  window.onAuthReady = new Promise(resolve => {
  	window.onAuthReadyResolve = resolve;
  });
  checkAuthReady();
  function checkAuthReady() {
  	if ( window.auth0 ) onAuthReadyResolve();
  	else setTimeout(checkAuthReady, 100);
  }
}