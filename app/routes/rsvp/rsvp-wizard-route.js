import Ember from 'ember';

export default Ember.Route.extend({
  fieldbook: Ember.inject.service(),

  model() {
    return this.modelFor('rsvp');
  },

  setupController(controller, model) {
    this._super(...arguments);

    controller.set('rsvp', model.rsvp);
    controller.set('guests', model.guests);
    controller.set('food', model.food);
    controller.set('plusOne', model.plusOne);
  },

  saveModelAndTransitionToRoute(route, hasResponded) {
    return this.get('fieldbook')
        .updateModel(this.modelFor('rsvp'), hasResponded)
        .then(() => this.transitionTo(route));
  }
});
