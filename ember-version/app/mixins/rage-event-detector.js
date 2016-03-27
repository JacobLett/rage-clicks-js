import Ember from 'ember';
import $ from 'jquery';

const { computed, K } = Ember;
const bound = function(fnName) {
  return computed(fnName, function() {
    return this.get(fnName).bind(this);
  });
};

export default Ember.Mixin.create({
  rageEventDetector: K,
  clickHandler: bound('rageClickHandler'),

  rageClickHandler(e) {
    const element = this.get('element');
    const $target = $(e.target);
    const isInside = $target.closest(element).length === 1;
    if (!isInside) {
      this.rageEventDetector(e);
    }
  },

  addRageClickListener() {
    const clickHandler = this.get('clickHandler');
    $(window).on('click', clickHandler);
  },

  removeRageClickListener() {
    const clickHandler = this.get('clickHandler');
    $(window).off('click', clickHandler);
  }
});
