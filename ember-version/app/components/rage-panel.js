import Ember from 'ember';
import $ from 'jquery';

const get = Ember.get;
const { isPresent, Logger } = Ember;

export default Ember.Component.extend({
   // since our service is named 'support' in the `app/services` path
   // we do not have to specify a name here for dependency injection.
   //
   // otherwise we'd do something like `foo: Ember.inject.service('support')`
  support: Ember.inject.service(),
  tagName: 'canvas',

  actions: {
    rageClickHandler(param){
      const support = get(this, 'support');

      Ember.Logger.log("Rage Click Detected", param);
      this.drawClickEvent(param.points);

      if (isPresent(support)) {
        support.trackEvent('rage-click');
      }
    }
  },
  quader: function () {
      return this.get('controller.model');
  }.property('controller.model'),

  didInsertElement: function(){
    /** Setup Intercom.io Ember Service **/
    // this should really occur in an ember base route, like the application route - but this if fine for now

    // try to get an instance of the support service that we injected with the intercom global
    const support = get(this, 'support');
    if (isPresent(support)) {
      // if the service loaded, lets bootstrap it with our base data
      support.boot();
    } else {
      Logger.debug('something is wrong trying to load the support service');
    }
    /* end intercom.io ember service setup */

    var canvas = this.get('element');
    canvas.width = $("body").width();
    canvas.height = $("body").height();
  },

  drawClickEvent: function(points){
    var canvas = this.get('element');
    var ctx = canvas.getContext('2d');

    ctx.strokeStyle = this.getRandomColor();
    ctx.beginPath();
    ctx.moveTo(points[0].event.clientX, points[0].event.clientY);
    for(var i = 1; i < points.length; i++){
      ctx.lineTo(points[i].event.clientX, points[i].event.clientY);
    }
    ctx.lineTo(points[0].event.clientX, points[0].event.clientY);
    ctx.stroke();
  },

  getRandomColor: function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
});
