/*
    latest changes
    - now allows multiple instances on one page
    - drop density adjusted
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
				dropDensity: 50, //density of drops
				speed: 15,
				wind: -5, //generally a higher wind speed looks better with a higher speed
				dropwidth: 1,
				dropheight: 4
			}, this.defaults, this.options);

			var functions = {
                canvas: {
                    initCanvas: function(){ // create canvas and get context
                        var canvasname = 'canvas' + Date.now(); //generate a unique canvas name, needed for multiple instances
                        var $canvas = $('<canvas/>').addClass('w-canvas').attr('id',canvasname);
                        $canvas.appendTo(thisobj.$elem);
                        thisobj.canvas = document.getElementById(canvasname);
                        thisobj.context = thisobj.canvas.getContext('2d');
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
                        var dropdensity = (thisobj.canvas.width / 100) * thisobj.settings.dropDensity;
                        // set start and end point for falling drops
                        thisobj.minstart = -20;
                        thisobj.maxstop = thisobj.canvas.height + 20;
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
                        var rand = 0.33; //controls the variation in size and speed of the drops. Taller (ie. closer) drops fall quicker, giving the illusion of depth
        
                        for(var i = 0; i < thisobj.drops.length; i++){
                            thisobj.drops[i][1] = thisobj.drops[i][1] + thisobj.settings.speed + (rand * 3); //speed of fall
                            if(thisobj.drops[i][1] > thisobj.maxstop){ //reset to top
                                thisobj.drops[i][1] = thisobj.minstart;
                            }

                            thisobj.context.save();
                            thisobj.context.fillStyle = 'rgba(0,0,0,' + rand + ')';//thisobj.settings.colour;
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
        
                            rand += 0.33;
                            if(rand > 1){
                                rand = 0.33;
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