import Ember from 'ember';
import RSVPRoute from './rsvp-wizard-route';

export default RSVPRoute.extend({
  arrayHelpers: Ember.inject.service(),
  guest: Ember.inject.service(),

  afterModel(model) {
    // Default all guests to attending and set their meal
    model.guests = this.get('arrayHelpers').map(model.guests, guest => {
      guest.isattending = true;
      this.get('guest').setDefaultMeal(guest, model.food);

      return guest;
    });
  },

  setupController(controller, model) {
    this._super(...arguments);

    controller.set('errors', null);
  },

  actions: {
    next() {
      this.saveModelAndTransitionToRoute('rsvp.music');
    }
  }
});
