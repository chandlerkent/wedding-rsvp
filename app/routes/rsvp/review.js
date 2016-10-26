import Ember from 'ember';
import RSVPRoute from './rsvp-wizard-route';

export default RSVPRoute.extend({
  actions: {
    submit() {
      this.saveModelAndTransitionToRoute('rsvp.done', true);
    },

    change() {
      this.saveModelAndTransitionToRoute('rsvp.attending');
    }
  }
});
