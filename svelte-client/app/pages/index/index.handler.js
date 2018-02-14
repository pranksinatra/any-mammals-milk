/**
 * Home page -> swipe left/right on mammals
 */
import Index from './index.page';

export default class IndexHandler {
  get route() {
    return {
      enter(current, previous) {
        this.component = new Index({
          target: document.getElementById('app'),
          data: {
            page: 'index'
          }
        })
        console.log('> Entered index route');
      },
      leave(current, previous) {
        this.component.destroy();
        console.log('< Left index route');
      }
    }
  }
}