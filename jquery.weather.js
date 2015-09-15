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
            this.dropDarkness = [];

			this.settings = $.extend({
				weatherType: "rain",
				dropDensity: 40, //density of drops
				speed: 10,
				wind: -5, //generally a higher wind speed looks better with a higher speed
				dropDarkness: 0.5,
				dropwidth: 1,
				dropheight: 2
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
                        if(thisobj.settings.dropDarkness > 1 || thisobj.settings.dropDarkness < 0)
                            thisobj.settings.dropDarkness = 1;
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
                        
                        //initialise drop darkness - FIXME
                        thisobj.dropDarkness.push(thisobj.settings.dropDarkness);
                        thisobj.dropDarkness.push((thisobj.settings.dropDarkness / 3) * 2);
                        thisobj.dropDarkness.push(thisobj.settings.dropDarkness / 3);
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
                        var rand = 0.2; //controls the variation in size and speed of the drops. Taller (ie. closer) drops fall quicker and are bigger, giving the illusion of depth. In theory.
                        var dd = 0; //switches between the darkness settings for the drops

                        for(var i = 0; i < thisobj.drops.length; i++){
                            thisobj.drops[i][1] = thisobj.drops[i][1] + thisobj.settings.speed + (rand * 10); //speed of fall
                            if(thisobj.drops[i][1] > thisobj.maxstop){ //reset to top
                                thisobj.drops[i][1] = thisobj.minstart;
                            }

                            thisobj.context.save();
                            thisobj.context.fillStyle = 'rgba(0,0,0,' + thisobj.dropDarkness[dd] + ')';//thisobj.settings.colour;
                            //console.log(thisobj.dropDarkness[dd]);
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
                                thisobj.context.fillRect(0,0, thisobj.settings.dropwidth, thisobj.settings.dropheight + (rand * 8)); //size of drop
                            }
                            else {
                                thisobj.context.fillRect(thisobj.drops[i][0],thisobj.drops[i][1], thisobj.settings.dropwidth, thisobj.settings.dropheight + (rand * 8));
                            }
                            thisobj.context.restore();
        
                            rand += 0.2;
                            if(rand > 1){
                                rand = 0.2;
                            }
                            dd += 1;
                            if(dd >= thisobj.dropDarkness.length){
                                dd = 0;
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