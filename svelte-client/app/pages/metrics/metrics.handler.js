/**
 * Metrics page -> scroll through and search for mammals
 */
import Metrics from './metrics.page';

export default class MetricsHandler {
  get route() {
    return {
      enter(current, previous) {
        this.component = new Metrics({
          target: document.getElementById('app'),
          data: {
            page: 'metrics'
          }
        })
        console.log('> Entered metrics route');
      },
      leave(current, previous) {
        this.component.destroy();
        console.log('< Left metrics route');
      }
    }
  }
}