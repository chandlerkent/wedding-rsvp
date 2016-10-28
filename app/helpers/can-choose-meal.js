import Ember from 'ember';

export function canChooseMeal(params/*, hash*/) {
  let guest = params[0];
  
  return (guest.type !== 'child' && guest.type !== 'baby');
}

export default Ember.Helper.helper(canChooseMeal);
