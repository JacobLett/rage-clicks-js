$(document).ready(function() {
 // executes when HTML-Document is loaded and DOM is ready
console.log("document is ready");
  	var clk_events = [];
	var radius = 100;//certain circle area 
	var possible_click = 5;
	var rageMode;
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
				console.log(result + ' triple click');
				rageMode = true;
			}
		}
		console.log(event.pageX, event.pageY);
		if(rageMode){
			console.log(' rage');
		}
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


  

  
	


  


  
  
// document ready  
});

