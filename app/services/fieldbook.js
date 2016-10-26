import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';
import ENV from 'wedding/config/environment';

export default AjaxService.extend({
  host: `https://api.fieldbook.com/v1/${ENV.fieldbook.bookId}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': `Basic ${ENV.fieldbook.authorization}`
  },

  getModelForCode(code) {
    if (!code) {
      return Ember.RSVP.reject('No code');
    }

    code = code.toUpperCase();

    // Fix Whitey
    if (code === 'P995') {
      code = 'P99S';
    }

    let rsvp = this.request(`/rsvp?code=${code}`).then(pluckFirst).then(rsvp => {
      if (!rsvp) {
        throw new Error('No RSVP with code: ' + code);
      }

      rsvp.plusone = convertPicklistToBoolean(rsvp.plusone);

      return rsvp;
    });
    let guests = this.request(`/guests?rsvp=${code}`).then(transformGuests);
    let food = this.request('/food');

    return Ember.RSVP.hash({ rsvp, guests, food }).then(result => {
      let plusOnes = result.guests.filter(guest => !guest.isprimary);
      result.guests = result.guests.filter(guest => guest.isprimary);

      if (result.rsvp.plusone) {
        if (plusOnes.length > 0) {
          result.plusOne = plusOnes[0];
        } else {
          result.plusOne = createPlusOne();
        }
      } else {
        result.plusOne = false;
      }

      return result;
    });
  },

  update(url, data) {
    return this.patch(url, {
      data: JSON.stringify(data),
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  },

  create(url, data) {
    return this.post(url, {
      data: JSON.stringify(data),
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  },

  destroy(url) {
    return this.delete(url, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  },

  updateModel(model, finalResponse) {
    let rsvp = {
      hasresponded: convertBooleanToPicklist(!!finalResponse),
      music: model.rsvp.music,
      specialrequests: model.rsvp.specialrequests
    };

    let guests = model.guests.map(guest => {
      return {
        firstname: guest.firstname,
        lastname: guest.lastname,
        isattending: convertBooleanToPicklist(guest.isattending),
        food: getFoodForGuest(guest),
        id: guest.id
      };
    });

    let plusOnePromise = Ember.RSVP.resolve();
    if (model.plusOne) {
      let plusOne = {
        firstname: model.plusOne.firstname,
        lastname: model.plusOne.lastname,
        isattending: convertBooleanToPicklist(model.plusOne.isattending),
        isprimary: convertBooleanToPicklist(false),
        food: getFoodForGuest(model.plusOne),
        rsvp: { id: model.rsvp.id }
      };

      if (model.plusOne.isattending) {
        if (model.plusOne.id) {
          plusOnePromise = this.update(`/guests/${model.plusOne.id}`, plusOne);
        } else {
          plusOnePromise = this.create('/guests', plusOne).then((response) => {
            model.plusOne.id = response.id;

            return response;
          });
        }
      } else {
        if (model.plusOne.id) {
          plusOnePromise = this.destroy(`/guests/${model.plusOne.id}`).then(() => {
            model.plusOne = createPlusOne();
          });
        }
      }
    }

    let rsvpPromise = this.update(`/rsvp/${model.rsvp.id}`, rsvp);

    let guestsPromise = Ember.RSVP.all(guests.map(guest => {
      let id = guest.id;
      delete guest.id;
      return this.update(`/guests/${id}`, guest);
    }));

    return Ember.RSVP.hash({
      rsvp: rsvpPromise,
      guests: guestsPromise,
      plusOne: plusOnePromise
    });
  }
});

function pluckFirst(array) {
  return array[0];
}

function transformGuests(guests) {
  return guests.map(guest => {
    guest.isattending = convertPicklistToBoolean(guest.isattending);
    guest.isprimary = convertPicklistToBoolean(guest.isprimary);
    guest.food = (guest.food && (guest.food.length > 0) && guest.food[0] && guest.food[0].id) || null;

    return guest;
  });
}

function convertPicklistToBoolean(value) {
  if (value === null || value === undefined) { return false; }
  if (value.toLowerCase() === 'yes') { return true; }

  return false;
}

function convertBooleanToPicklist(value) {
  return (!!value ? 'yes' : 'no');
}

function createPlusOne() {
  return {
    firstname: '',
    lastname: '',
    isattending: false,
    isprimary: false,
    food: null
  }
}

function getFoodForGuest(guest) {
  return (guest.isattending && guest.food && guest.food > 0 && { id: guest.food }) || [];
}
