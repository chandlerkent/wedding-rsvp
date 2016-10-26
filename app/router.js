import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('rsvp', { path: '/rsvp/:code' }, function() {
    this.route('attending', function() {
      this.route('yes');
      this.route('no');
    });
    this.route('guests');
    this.route('music');
    this.route('review');
    this.route('done');
    this.route('special-request');
  });
});

export default Router;
