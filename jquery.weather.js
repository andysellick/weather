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
            this.canvas;
            this.context;
            this.spacing;
            this.minstart;
            this.maxstop;
            this.drops;

			this.settings = $.extend({
				weatherType: "rain",
				dropDensity: 5, //density of drops
				colour: '#000000', //can be a hex value or a string e.g. 'green'
				speed: 15,
				wind: -5, //generally a higher wind speed looks better with a higher speed
				dropwidth: 1,
				dropheight: 4
			}, this.defaults, this.options);
			
			var functions = {
                canvas: {
                    initCanvas: function(){ // create canvas and get context
                        var $canvas = $('<canvas/>').addClass('w-canvas').attr('id','canvas');
                        $canvas.appendTo(thisobj.$elem);
                        thisobj.canvas = document.getElementById('canvas');
                        thisobj.context = canvas.getContext('2d');
                        functions.canvas.initialise();
                    },
                    initialise: function(){ //make canvas the same size as its parent, call on window resize
                        thisobj.canvas.width = thisobj.$elem.outerWidth();
                        thisobj.canvas.height = thisobj.$elem.outerHeight();
                    },
                    clearCanvas: function(){
                        thisobj.context.clearRect(0, 0, thisobj.canvas.width, thisobj.canvas.height);//clear the canvas
                    }
                },
                general: {
                    overrideSettings: function(){ //prevent settings abuse
            			if(thisobj.settings.wind > 35)
                            thisobj.settings.wind = 35;
            			if(thisobj.settings.wind < -35)
                            thisobj.settings.wind = -35;
                    },
                    initDrops: function(){ //create array to store position of drops and initialise related variables
                        //init drop density
                        var dropdensity = (thisobj.canvas.width / 10) * thisobj.settings.dropDensity;
                        // set start and end point for falling drops
                        thisobj.minstart = -10;
                        thisobj.maxstop = thisobj.canvas.height + 10;
                        thisobj.spacing = thisobj.canvas.width / dropdensity;
                        //init array of drops
                        thisobj.drops = [];
                        for(var i = 0; i < dropdensity; i++){
                            thisobj.drops.push([thisobj.spacing * i,functions.general.randomIntFromInterval(thisobj.minstart,thisobj.maxstop)]);
                        }
                        //console.log(thisobj.drops.length,"number of drops");
                    },
                    //return a random number
                    randomIntFromInterval: function(min,max){
                        return Math.floor(Math.random()*(max-min+1)+min);
                    },
                    resizeWindow: function(){
                        functions.canvas.initialise();
                        functions.general.initDrops();
                    },
                    drawloop: function(){ //self calling function that animates the falling precipitation
                        functions.canvas.clearCanvas();
                        var rand = 0; //controls the slight variation in the length and speed of some of the drops. Taller (ie. closer) drops fall quicker, giving the illusion of depth
        
                        for(var i = 0; i < thisobj.drops.length; i++){
                            if(thisobj.drops[i][1] > thisobj.maxstop){ //reset to top
                                thisobj.drops[i][1] = thisobj.minstart;
                            }
                            thisobj.drops[i][1] = thisobj.drops[i][1] + thisobj.settings.speed + rand;
        
                            thisobj.context.save();
                            thisobj.context.fillStyle = thisobj.settings.colour;
                            /* do slightly more complex stuff to translate and rotate drops if wind present */
                            if(thisobj.settings.wind){
                                thisobj.drops[i][0] += (thisobj.settings.wind / 2);
                                if(thisobj.drops[i][0] > thisobj.canvas.width)
                                    thisobj.drops[i][0] = 0;
                                if(thisobj.drops[i][0] < 0)
                                    thisobj.drops[i][0] = thisobj.canvas.width;
        
                                thisobj.context.translate(thisobj.drops[i][0], thisobj.drops[i][1]);
                                thisobj.context.rotate(-thisobj.settings.wind * Math.PI / 90);
                                //we draw this point at 0,0 because the context has already been translated to the position where we want to draw the drop
                                thisobj.context.fillRect(0,0, thisobj.settings.dropwidth, thisobj.settings.dropheight + rand);
                            }
                            else {
                                thisobj.context.fillRect(thisobj.drops[i][0],thisobj.drops[i][1], thisobj.settings.dropwidth, thisobj.settings.dropheight + rand);
                            }
                            thisobj.context.restore();
        
                            rand += 0.25;
                            if(rand > 2){
                                rand = 0;
                            }
                        }
                        gameloop = setTimeout(functions.general.drawloop,40); //repeat
                    }
                }
            }

            $(window).on('load',function(){
                functions.general.overrideSettings();
                functions.canvas.initCanvas();
                functions.general.initDrops();
                functions.general.drawloop();
            });

            var resize;
        	$(window).on('resize',function(){
                //don't resize immediately
                clearTimeout(resize);
                resize = setTimeout(functions.general.resizeWindow,200);
        	});
		}
	}
	$.fn.weather = function(options){
		return this.each(function(){
			new Plugin(this,options).init();
		});
	}
	window.Plugin = Plugin;
})(window,jQuery);