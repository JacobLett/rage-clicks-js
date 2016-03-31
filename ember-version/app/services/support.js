import Ember from 'ember';

const get = Ember.get; // i like using `get(this, 'foo')` or `get(context, 'foo')` rather than `this.get()`
const set = Ember.set; // same as above
const { isPresent, Logger } = Ember; // avoid having to type `Ember.isPresent` or `Ember.Logger`

// it makes sense to use a Ember.Service with the intercom stuff since we'd theoretically want it available
// globally and likely a singleton

export default Ember.Service.extend({
  // default values. in a real app, i'd likely load the appId from environment data setup in `config/environment.js`
  userData: null,
  appId: 'p0q3nra6',

  boot() {
    Logger.debug('support service:boot');

    const intercom = get(this, 'intercom');
    const appId = get(this, 'appId');

    if (isPresent(intercom)) { // make sure we can actually load the expected intercom global before messing with it

      let intercomData = {
        app_id: appId,
        email: 'test1@test1.io',
        user_id: 25,
        name: 'Bob Smith',
        widget: {
          activator: '#Intercom',
          use_counter: true,
          activator_html: function( obj ) {
            let html = '<span class="text keyboard-hint">Support</span>';
            const unread = obj.owner.inbox.get_unread_count({look_in: 'inbox'});
            if (unread) {
              html += `<span class="icon unread-count">${unread}</span>`;
            } else {
              html += '<i class="icon fa fa-question-circle"></i>';
            }
            return html;
          }
        }
      };

      if (isPresent(intercomData)) {
        set(this, 'userData', intercomData);
        intercom('boot', get(this, 'userData'));
      }
    }
  },

  // you *should* be able to call `trackEvent('rage-click')` and send an event
  // I found this info here -
  // https://docs.intercom.io/configuring-for-your-product-or-site/the-intercom-javascript-api
  // hard to say if intercom will send it over websocket or a POST
  trackEvent(eventName) {
    const intercom = get(this, 'intercom');

    if (isPresent(intercom)) {

      intercom('trackEvent', eventName);

      Logger.info('theoretically sent event to Intercom');
    } else {
      Logger.debug('something is wrong and the intercom registry did not load');
    }
  },

  update() {
    const intercom = get(this, 'intercom');
    const userData = get(this, 'userData');

    if (isPresent(intercom) && isPresent(userData)) {
      intercom('update', userData);
    }
  },
});
