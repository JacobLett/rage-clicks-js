import Ember from 'ember';
import RageEventDetector from '../mixins/rage-event-detector';
import layout from '../templates/components/rage-event-detector';
import $ from 'jquery';
const { on } = Ember;
const { next } = Ember.run;

export default Ember.Component.extend(RageEventDetector, {
  layout,
  onDetectEvent(result){
    this.sendAction(result);
  },
  rageEventDetector(e) {
    const exceptSelector = this.attrs['except-selector'];

    if (exceptSelector && $(e.target).closest(exceptSelector).length > 0) {
      return;
    }

    const clkEvnets = this.get("clkEvnets");
    var possibleClick = this.get("possibleClick");

    clkEvnets.push({
      event: e,
      time: new Date()
    });

    //remain only required number of click events and remove left of them.
    if(clkEvnets.length > possibleClick){
      clkEvnets.splice(0, clkEvnets.length - possibleClick);
    }
    //detect 3 click in 5 sec
    if(clkEvnets.length >= 3){
      var result = this.detectTripleClick(3, 5);
      if(result != null){
        Ember.Logger.log(result);
        this.removeUsedClickPoints(3);
        this.onDetectEvent(result);
      }
    }
    this.set("clkEvnets", clkEvnets);

  },

  _attachRageEventDetectorHandler: on('didInsertElement', function() {
    next(this, this.addRageClickListener);
  }),

  _removeRageEventDetectorHandler: on('willDestroyElement', function() {
    this.removeRageClickListener();
  }),
  clkEvnets : [],
  radius: 100,
  possibleClick : 5,
  detectTripleClick: function(count, interval){
    const clkEvnets = this.get("clkEvnets");
    var radius = this.get("radius");
    var last = clkEvnets.length - 1;
    
    var timeDiff = (clkEvnets[last].time.getTime() - clkEvnets[last - count + 1].time.getTime()) / 1000;
    //returns false if it event period is longer than 5 sec
    if(timeDiff > interval) {
      return null;
    }

    //check click distance
    var maxDistance = 0;
    for(var i = last - count + 1; i < last; i++){
      for(var j = i + 1; j <= last; j++){
        var distance = Math.round(Math.sqrt(Math.pow(clkEvnets[i].event.clientX - clkEvnets[j].event.clientX, 2) +
                                      Math.pow(clkEvnets[i].event.clientY - clkEvnets[j].event.clientY, 2)));
        if(distance > maxDistance) {
          maxDistance = distance;
        }
        if(distance > radius) {
          return null;
        }
      }
    }
    var result = {};
    result.count = count;
    result.maxDistance = maxDistance;
    result.actionPeriod = timeDiff;
    result.points = [clkEvnets[i - 2], clkEvnets[i - 1], clkEvnets[i]];
    return result;
  },

  removeUsedClickPoints: function(count){
    const clkEvnets = this.get("clkEvnets");
    clkEvnets.splice(clkEvnets.length - count, count);
    this.set("clkEvnets", clkEvnets);
  }

});
