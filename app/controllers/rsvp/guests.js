import Ember from 'ember';

const MEAL_TYPES = {
  ADULT: 'adult',
  CHILD: 'child',
  BABY: 'baby'
};

export default Ember.Controller.extend({
  arrayHelpers: Ember.inject.service(),
  isBringingPlusOne: false,
  plusOne: null,
  errors: null,
  food: null,

  babyMeals: Ember.computed('food', function () {
    return this.get('arrayHelpers').filter(this.get('food'), item => item.type === MEAL_TYPES.BABY);
  }),

  childMeals: Ember.computed('food', function () {
    return this.get('arrayHelpers').filter(this.get('food'), item => item.type === MEAL_TYPES.CHILD);
  }),

  teenagerMeals: Ember.computed('food', function () {
    return this.get('arrayHelpers').filter(this.get('food'), item => item.type === MEAL_TYPES.CHILD || item.type === MEAL_TYPES.ADULT);
  }),

  adultMeals: Ember.computed('food', function () {
    return this.get('arrayHelpers').filter(this.get('food'), item => item.type === MEAL_TYPES.ADULT);
  }),

  isAttending(guest, isAttending) {
    Ember.set(guest, 'isattending', (parseInt(isAttending, 10) === 1));
    if (!guest.isattending) { return; }

    if (guest.type === MEAL_TYPES.CHILD) {
      Ember.set(guest, 'food', this.get('childMeals')[0].id);
    }
    if (guest.type === MEAL_TYPES.BABY) {
      Ember.set(guest, 'food', this.get('babyMeals')[0].id);
    }
  },

  bringPlusOne(bringingOne) {
    this.set('isBringingPlusOne', (parseInt(bringingOne, 10) === 1));
    if (this.get('isBringingPlusOne')) {
      this.set('plusOne', { firstname: '', lastname: '', food: '' });
    }
  },

  validate() {
    this.set('errors', null);

    let guestsResult = this.get('arrayHelpers')
      .map(this.get('guests'), guest => this.validateGuest(guest));

    let plusOneResult = this.validateGuest(this.get('plusOne'));

    let allResults = this.get('arrayHelpers')
      .filter(guestsResult.concat(plusOneResult), result => !!result);

    this.set('errors', allResults.length > 0 ? allResults : null);

    return (allResults.length < 1);
  },

  validateGuest(guest) {
    if (!guest.isattending) { return ''; }

    if (!guest.firstname) { return 'Guest\'s first name is empty.'; }
    if (!guest.lastname) { return `${guest.firstname}\'s last name is empty.`; }
    if (!guest.food || (parseInt(guest.food, 10) < 0)) { return `Please select a meal for ${guest.firstname} ${guest.lastname}`; }

    return '';
  },

  actions: {
    next() {
      return this.validate();
    }
  }
});
