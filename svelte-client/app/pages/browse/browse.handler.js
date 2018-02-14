/**
 * Browse page -> scroll through and search for mammals
 */
import Browse from './browse.page';

export default class BrowseHandler {
  get route() {
    return {
      enter(current, previous) {
        this.component = new Browse({
          target: document.getElementById('app'),
          data: {
            page: 'browse'
          }
        })
        console.log('> Entered browse route');
      },
      leave(current, previous) {
        this.component.destroy();
        console.log('< Left browse route');
      }
    }
  }
}