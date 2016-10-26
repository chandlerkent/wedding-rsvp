import Ember from 'ember';

export default Ember.Controller.extend({
  isBringingPlusOne: false,
  plusOne: null,

  isAttending(guest, isAttending) {
    Ember.set(guest, 'isattending', (parseInt(isAttending, 10) === 1));
  },

  bringPlusOne(bringingOne) {
    this.set('isBringingPlusOne', (parseInt(bringingOne, 10) === 1));
    if (this.get('isBringingPlusOne')) {
      this.set('plusOne', { firstname: '', lastname: '', food: '' });
    }
  }
});
