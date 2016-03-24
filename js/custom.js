$(document).ready(function(){
	var clk_events = [];
	var radius = 100;//certain circle area 
	var possible_click = 5;
	$("body").click(function(event){
		clk_events.push({
			event: event,
			time: new Date()
		});
		//remain only required number of click events and remove left of them.
		if(clk_events.length > possible_click){
			clk_events.splice(0, clk_events.length - possible_click);
		}
		//detect 3 click in 5 sec
		if(clk_events.length >= 3){
			var result = detect3Click(3, 5);
			if(result != null){
				console.log(result);
				drawClickEvent(3);
				removeUsedClickPoints(3);
			}
		}
		console.log(event.pageX, event.pageY);
	})

	function detect3Click(count, interval){
		var last = clk_events.length - 1;
		var timeDiff = (clk_events[last].time.getTime() - clk_events[last - count + 1].time.getTime()) / 1000;
		//returns false if it event period is longer than 5 sec
		if(timeDiff > interval) return null;

		//check click distance
		var max_distance = 0;
		for(i = last - count + 1; i < last; i++){
			for(j = i + 1; j <= last; j++){
				var distance = Math.round(Math.sqrt(Math.pow(clk_events[i].event.clientX - clk_events[j].event.clientX, 2) + 
                                    	Math.pow(clk_events[i].event.clientY - clk_events[j].event.clientY, 2)));
				if(distance > max_distance) max_distance = distance;
				if(distance > radius) return null;
			}
		}
		return "Clicks: " + count + ", Range: " + max_distance + "px, Period: " + timeDiff + " Sec";
	}

	function removeUsedClickPoints(count){
		clk_events.splice(clk_events.length - count, count);
	}

	//Canvas for test purpose
	var canvas  = document.getElementById("test_canvas");
	canvas.width = $("body").width();
	canvas.height = $("body").height();
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	console.log(canvasWidth, canvasHeight);
	var ctx = canvas.getContext("2d");
	

	function drawClickEvent(count){
		var last = clk_events.length - 1;
		ctx.strokeStyle=getRandomColor();
		ctx.beginPath();
		ctx.moveTo(clk_events[last-count+1].event.clientX, clk_events[last-count+1].event.clientY);
		for(i = last - count + 2; i <= last; i++){
			ctx.lineTo(clk_events[i].event.clientX, clk_events[i].event.clientY);
		}
		ctx.lineTo(clk_events[last-count+1].event.clientX, clk_events[last-count+1].event.clientY);
		ctx.stroke();
	}

	function getRandomColor() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}
})