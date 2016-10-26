import Ember from 'ember';

export default Ember.Route.extend({
  fieldbook: Ember.inject.service('fieldbook'),
  model(params) {
    return this.get('fieldbook').getModelForCode(params.code);
  },

  setupController(controller, model) {
    this._super(...arguments);

    controller.set('guests', model.guests);
    controller.set('rsvp', model.rsvp);
    controller.set('food', model.food);
  }
});
