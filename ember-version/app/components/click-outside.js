import Ember from 'ember';
import ClickOutside from '../mixins/click-outside';
import layout from '../templates/components/click-outside';
import $ from 'jquery';
const { Component, on } = Ember;
const { next } = Ember.run;

var clk_events = [];
var radius = 100;//certain circle area 
var possible_click = 5;

export default Ember.Component.extend(ClickOutside, {
  layout,
  actions:{
    sendAction(){
      this.get('onDetectEvent')();
    }
  },
  clickOutside(e) {
    const exceptSelector = this.attrs['except-selector'];
    if (exceptSelector && $(e.target).closest(exceptSelector).length > 0) {
      return;
    }
    clk_events.push({
      event: e,
      time: new Date()
    });

    //remain only required number of click events and remove left of them.
    if(clk_events.length > possible_click){
      clk_events.splice(0, clk_events.length - possible_click);
    }
    //detect 3 click in 5 sec
    if(clk_events.length >= 3){
      var result = this.detect3Click(3, 5);
      if(result != null){
        console.log(result);
        this.removeUsedClickPoints(3);
        this.actions.sendAction();

        // drawClickEvent(3);
      }
    }
    // console.log(event.pageX, event.pageY);
    // console.log(clk_events.length);
    // console.log(e.clientX, e.clientY);
    
  },

  _attachClickOutsideHandler: on('didInsertElement', function() {
    next(this, this.addClickOutsideListener);
  }),

  _removeClickOutsideHandler: on('willDestroyElement', function() {
    this.removeClickOutsideListener();
  }),
  clk_events : [],
  radius: 100,
  possible_click : 5,
  detect3Click: function(count, interval){
    var last = clk_events.length - 1;
    var timeDiff = (clk_events[last].time.getTime() - clk_events[last - count + 1].time.getTime()) / 1000;
    //returns false if it event period is longer than 5 sec
    if(timeDiff > interval) return null;

    //check click distance
    var max_distance = 0;
    for(var i = last - count + 1; i < last; i++){
      for(var j = i + 1; j <= last; j++){
        var distance = Math.round(Math.sqrt(Math.pow(clk_events[i].event.clientX - clk_events[j].event.clientX, 2) + 
                                      Math.pow(clk_events[i].event.clientY - clk_events[j].event.clientY, 2)));
        if(distance > max_distance) max_distance = distance;
        if(distance > radius) return null;
      }
    }
    return "Clicks: " + count + ", Range: " + max_distance + "px, Period: " + timeDiff + " Sec";
  },

  removeUsedClickPoints: function(count){
    clk_events.splice(clk_events.length - count, count);
  }

});