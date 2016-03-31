import Ember from 'ember';
import canUseDOM from '../utils/can-use-dom'; // see that file if you're wondering what it is

const { isPresent } = Ember;

// initializers are not recommended for most things, but makes sense in this scenario

export function initialize(application) {

  if (canUseDOM) {
    if (isPresent(window.Intercom)) {
      // this will grab the global 'Intercom' object from our index.html and register it within our app for injection
      application.register('intercom:main', window.Intercom, {instantiate: false});

      // this will inject the intercom global via the registry into our 'support' service, which is in `app/services/support.js`
      application.inject('service:support', 'intercom', 'intercom:main');
    }
  }
}

export default {
  name: 'inject-intercom',
  initialize: initialize
};
