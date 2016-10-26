/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'wedding',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    fieldbook: {
      bookId: '',
      key: ''
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV.fieldbook = setupFieldbookConfigurationForEnvironment(environment);

  if (!ENV.fieldbook) {
    throw new Error('Missing \'fieldbook\' key on ENV');
  }
  if (!ENV.fieldbook.bookId) {
    throw new Error('Missing \'fieldbook.bookId\' key on ENV');
  }
  if (!ENV.fieldbook.authorization) {
    throw new Error('Missing \'fieldbook.authorization\' key on ENV');
  }

  return ENV;
};

function createFieldbookAuthorization(userName, key) {
   return new Buffer(userName + ':' + key).toString('base64');
}

function setupFieldbookConfigurationForEnvironment(environment) {
  if (environment === 'test') {
    environment = 'development';
  }

  var environmentUpperCase = environment.toUpperCase();
  var fieldbookUserId = process.env[environmentUpperCase + '_FIELDBOOK_USER_ID'];
  var fieldbookUserKey = process.env[environmentUpperCase + '_FIELDBOOK_USER_KEY'];
  var fieldbookBookId = process.env[environmentUpperCase + '_FIELDBOOK_BOOK_ID'];

  if (!fieldbookUserId) {
    throw new Error('Missing environment variable ' + environmentUpperCase + '_FIELDBOOK_USER_ID');
  }
  if (!fieldbookUserKey) {
    throw new Error('Missing environment variable ' + environmentUpperCase + '_FIELDBOOK_USER_KEY');
  }
  if (!fieldbookBookId) {
    throw new Error('Missing environment variable ' + environmentUpperCase + '_FIELDBOOK_BOOK_ID');
  }

  return {
    bookId: fieldbookBookId,
    authorization: createFieldbookAuthorization(fieldbookUserId, fieldbookUserKey)
  };
}
