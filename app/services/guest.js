import Ember from 'ember';
import MEAL_TYPES from '../constants/meal-types';

export default Ember.Service.extend({
  arrayHelpers: Ember.inject.service(),

  setDefaultMeal(guest, meals) {
    if (guest.type === MEAL_TYPES.CHILD) {
      Ember.set(guest, 'food', this.getDefaultMealIdForChild(meals));
    }
    if (guest.type === MEAL_TYPES.BABY) {
      Ember.set(guest, 'food', this.getDefaultMealIdForBaby(meals));
    }
  },
  
  getDefaultMealIdForChild(food) {
    return this.get('arrayHelpers').filter(food, meal => meal.type === MEAL_TYPES.CHILD)[0].id;
  },
  
  getDefaultMealIdForBaby(food) {
    return this.get('arrayHelpers').filter(food, meal => meal.type === MEAL_TYPES.BABY)[0].id;
  }
});
