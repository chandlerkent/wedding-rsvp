import Ember from 'ember';

export default Ember.Controller.extend({
  fieldbook: Ember.inject.service(),
  code: null,
  isWorking: false,
  hasError: false,

  actions: {
    goToRsvp() {
      this.set('isWorking', true);
      this.set('hasError', false);
      let code = this.get('code');

      let rsvpRequest = this.get('fieldbook').getModelForCode(code);
      Ember.run.later(() => {
        rsvpRequest
          .catch(() => this.set('hasError', true))
          .then(result => this.transitionToRoute('rsvp', result.rsvp.code))
          .finally(() => this.set('isWorking', false));
      }, 500);
    }
  }
});
