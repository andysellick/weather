/*
*/
(function (window,$) {
	var Plugin = function(elem,options){
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options
	}

	Plugin.prototype = {
		init: function(){
			var thisobj = this;

			this.settings = $.extend({
				weatherType: "rain",
				drops: 1000,
				colour: '', //not yet in use
				speed: 15, //probably max 20
				wind: 0 //min/max 10
			}, this.defaults, this.options);
			
			/* override some options to provide min/max */
			if(thisobj.settings.wind > 10)
                thisobj.settings.wind = 10;
			if(thisobj.settings.wind < -10)
                thisobj.settings.wind = -10;

            /* create canvas and get context */
            var $canvas = $('<canvas/>').addClass('canvas').attr('id','canvas');
            $canvas.appendTo(thisobj.$elem);
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            //context.fillStyle = 'red';

    		/* find width and height of canvas */
    		var panewidth = $canvas.width();
    		var paneheight = $canvas.height();
    		$canvas.attr('width',panewidth).attr('height',paneheight); //need to set this as attributes otherwise canvas doesn't work properly
            var spacing = panewidth / this.settings.drops;

            /* set start and end point for falling drops */
            var minstart = -10;
            var maxstop = paneheight + 10;

            /* create array to store position of drops */
            var drops = [];
            for(var i = 0; i < this.settings.drops; i++){
                drops.push([spacing * i,randomIntFromInterval(minstart,maxstop)]);
            }
            drawloop();

            //self calling function that animates the falling precipitation
            function drawloop(){
                clearCanvas();
                var widget = 0; //controls the slight variation in the length and speed of some of the drops. Taller (ie. closer) drops fall quicker, giving the illusion of depth

                for(var i = 0; i < drops.length; i++){
                    if(drops[i][1] > maxstop) //reset to top
                        drops[i][1] = minstart;
                    drops[i][1] = drops[i][1] + thisobj.settings.speed + widget;

                    context.save();
                    /* do slightly more complex stuff to translate and rotate drops if wind present */
                    if(thisobj.settings.wind){
                        drops[i][0] += thisobj.settings.wind;
                        if(drops[i][0] > panewidth)
                            drops[i][0] = 0;
                        if(drops[i][0] < 0)
                            drops[i][0] = panewidth;

                        context.translate(drops[i][0], drops[i][1]);
                        context.rotate(Math.PI / -thisobj.settings.wind);
                        context.fillRect(0,0, 1, 2 + widget); //we draw the point at 0,0 because the context has already been translated to the position where we want to draw the drop
                    }
                    else {
                        context.fillRect(drops[i][0],drops[i][1], 1, 2 + widget);
                    }
                    context.restore();

                    widget += 1;
                    if(widget > 4)
                        widget = 0;
                }
                gameloop = setTimeout(drawloop,40); //repeat
            }

            function clearCanvas(){
                context.clearRect(0, 0, canvas.width, canvas.height);//clear the canvas
                var w = canvas.width;
                canvas.width = 1;
                canvas.width = w;
            }

            //currently unused
            function randomIntFromInterval(min,max){
                return Math.floor(Math.random()*(max-min+1)+min);
            }

            //not yet in use
            function resizeWindow(){
                console.log('resize');
            }


            var resize;
        	$(window).on('resize',function(){
                //don't resize immediately
                clearTimeout(resize);
                resize = setTimeout(resizeWindow,200);
        	});
		},

		//below a given screen size, remove all plugin functionality
		destroy: function(){
			console.log('deactivating plugin');
		},

	}

	$.fn.weather = function(options){
		return this.each(function(){
			new Plugin(this,options).init();
		});
	}

	window.Plugin = Plugin;

})(window,jQuery);