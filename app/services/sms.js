import AjaxService from 'ember-ajax/services/ajax';
import ENV from 'wedding/config/environment';

export default AjaxService.extend({
  host: ENV.smsUrl,
  headers: {
    'Accept': 'application/json'
  },

  rsvp(data) {
    return this.post('/rsvp', {
      data: JSON.stringify(data),
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
});
