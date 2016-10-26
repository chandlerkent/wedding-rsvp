import Ember from 'ember';

export function lookupMeal(params) {
  let meals = params[1];

  let foundMeals = meals.filter(meal => {
    return parseInt(meal.id, 10) === parseInt(params[0], 10);
  });

  if (foundMeals.length < 1) { return ''; }

  return foundMeals[0].name;
}

export default Ember.Helper.helper(lookupMeal);
