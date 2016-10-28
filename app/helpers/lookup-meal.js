import Ember from 'ember';

export default Ember.Helper.extend({
  arrayHelpers: Ember.inject.service(),

  compute(params) {
    let meals = params[1];

    let foundMeals = this.get('arrayHelpers').filter(meals, meal => {
      return parseInt(meal.id, 10) === parseInt(params[0], 10);
    });

    if (foundMeals.length < 1) { return ''; }

    return foundMeals[0].name;
  }
});
