import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({

	tagName: 'canvas',
	actions: {
		rageClickHandler(param){
			console.log("Rage Click Detected", param);
			this.drawClickEvent(param.points);
		}
	},
	quader: function () {
	    return this.get('controller.model');
	}.property('controller.model'),
	didInsertElement: function(){
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
