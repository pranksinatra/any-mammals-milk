/*
 * This is the entrypoint of all the JavaScript files.
 */

import Routes from './routes';

document.addEventListener('DOMContentLoaded', main);

function main() {
  console.log('v0.0.3');

  window.Routes = new Routes();
}
