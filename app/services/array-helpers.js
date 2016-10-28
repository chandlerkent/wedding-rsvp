import Ember from 'ember';

export default Ember.Service.extend({
  map(array, fn) {
    let output = [];

    for (var i = 0; i < array.length; i++) {
      output.push(fn(array[i]));
    }

    return output;
  },

  filter(array, fn) {
    let output = [];

    for (var i = 0; i < array.length; i++) {
      if (fn(array[i])) {
        output.push(array[i]);
      }
    }

    return output;
  }
});
