import Ember from 'ember';
import RSVPRoute from './rsvp-wizard-route';

export default RSVPRoute.extend({
  actions: {
    next() {
      this.saveModelAndTransitionToRoute('rsvp.review');
    }
  }
});
