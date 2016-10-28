import RSVPRoute from '../rsvp-wizard-route';

export default RSVPRoute.extend({
  actions: {
    yes() {
      let model = this.modelFor('rsvp');
      // Default all guests to attending
      model.guests = model.guests.map(guest => {
        guest.isattending = true;

        return guest;
      });
      this.transitionTo('rsvp.attending.yes');
    },

    no() {
      let model = this.modelFor('rsvp');
      model.guests = model.guests.map(guest => {
        guest.isattending = false;
        guest.food = [];

        return guest;
      });
      model.plusOne = model.plusOne || {};
      model.plusOne.isattending = false;

      model.rsvp.music = null;
      model.rsvp.specialrequests = null;

      this
        .get('fieldbook')
        .updateModel(model, true)
        .then(() => this.transitionTo('rsvp.attending.no'));
    }
  }
});
