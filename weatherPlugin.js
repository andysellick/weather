/* plugin to create rain effect on a webpage. https://github.com/andysellick/weather */
function weatherObj(element,options){
	this.el = element;
	//this.canvas;
	//this.context;
	//this.spacing;
	//this.minstart;
	//this.maxstop;
	//this.drops;
	this.dropDarkness = [];
	this.resize = 0;
	this.settings = {
		dropDensity: (typeof options.dropDensity === 'undefined') ? 40 : options.dropDensity, //density of drops
		dropColor: (typeof options.dropColor === 'undefined') ? [0,0,0] : options.dropColor, //density of drops
		speed: (typeof options.speed === 'undefined') ? 10 : options.speed,
		wind: (typeof options.wind === 'undefined') ? -5 : options.wind, //generally a higher wind speed looks better with a higher speed
		dropDarkness: (typeof options.dropDarkness === 'undefined') ? 0.5 : options.dropDarkness,
		dropWidth: (typeof options.dropWidth === 'undefined') ? 1 : options.dropWidth,
		dropHeight: (typeof options.dropHeight === 'undefined') ? 2 : options.dropHeight
	};
	var ths = this;
	this.functions = {
		canvas: {
			init: function(){
				ths.functions.general.overrideSettings();
				ths.functions.canvas.initCanvas();
				ths.functions.general.initDrops();
				ths.functions.general.drawloop();
			},
			initCanvas: function(){ // create canvas and get context
				ths.canvas = document.createElement('canvas');
				ths.canvas.className = 'w-canvas';
				//set styles, no need for a stylesheet when they're this simple
				ths.canvas.style.position = 'absolute';
				ths.canvas.style.top = 0;
				ths.canvas.style.left = 0;
				ths.el.style.position = 'relative'; //parent element

				ths.el.appendChild(ths.canvas);
				ths.context = ths.canvas.getContext('2d');
				ths.functions.canvas.initialise();
			},
			initialise: function(){ //make canvas the same size as its parent, call on window resize
				ths.canvas.width = ths.el.offsetWidth;
				ths.canvas.height = ths.el.offsetHeight;
			},
			clearCanvas: function(){
				ths.context.clearRect(0, 0, ths.canvas.width, ths.canvas.height);//clear the canvas
			}
		},
		general: {
			overrideSettings: function(){ //prevent settings abuse
				if(ths.settings.wind > 35){
					ths.settings.wind = 35;
				}
				if(ths.settings.wind < -35){
					ths.settings.wind = -35;
				}
				if(ths.settings.dropDarkness > 1 || ths.settings.dropDarkness < 0){
					ths.settings.dropDarkness = 1;
				}
				if(ths.settings.dropColor.constructor !== Array || ths.settings.dropColor.length !== 3){
					ths.settings.dropColor = [0,0,0];
				}
			},
			initDrops: function(){ //create array to store position of drops and initialise related variables
				//init drop density
				var dropdensity = (ths.canvas.width / 100) * ths.settings.dropDensity;
				// set start and end point for falling drops
				ths.minstart = -20;
				ths.maxstop = ths.canvas.height + 20;
				ths.spacing = ths.canvas.width / dropdensity;
				//init array of drops
				ths.drops = [];
				for(var i = 0; i < dropdensity; i++){
					ths.drops.push([ths.spacing * i,ths.functions.general.randomIntFromInterval(ths.minstart,ths.maxstop)]);
				}
				//console.log(thisobj.drops.length,"number of drops");

				//initialise drop darkness - FIXME
				ths.dropDarkness.push(ths.settings.dropDarkness);
				ths.dropDarkness.push((ths.settings.dropDarkness / 3) * 2);
				ths.dropDarkness.push(ths.settings.dropDarkness / 3);
			},
			//return a random number
			randomIntFromInterval: function(min,max){
				return Math.floor(Math.random()*(max-min+1)+min);
			},
			resizeWindow: function(){
				ths.functions.canvas.initialise();
				ths.functions.general.initDrops();
			},
			drawloop: function(){ //self calling function that animates the falling precipitation
				ths.functions.canvas.clearCanvas();
				var rand = 0.2; //controls the variation in size and speed of the drops. Taller (ie. closer) drops fall quicker and are bigger, giving the illusion of depth. In theory.
				var dd = 0; //switches between the darkness settings for the drops
			
				for(var i = 0; i < ths.drops.length; i++){
					ths.drops[i][1] = ths.drops[i][1] + ths.settings.speed + (rand * 10); //speed of fall
					if(ths.drops[i][1] > ths.maxstop){ //reset to top
						ths.drops[i][1] = ths.minstart;
					}

					ths.context.save();
					ths.context.fillStyle = 'rgba(' + ths.settings.dropColor[0] + ',' + ths.settings.dropColor[1] + ',' + ths.settings.dropColor[2] + ',' + ths.dropDarkness[dd] + ')';//ths.settings.colour;
					//console.log(ths.dropDarkness[dd]);
					/* do slightly more complex stuff to translate and rotate drops if wind present */
					if(ths.settings.wind){
						ths.drops[i][0] += (ths.settings.wind / 2);
						if(ths.drops[i][0] > ths.canvas.width){
							ths.drops[i][0] = 0;
						}
						if(ths.drops[i][0] < 0){
							ths.drops[i][0] = ths.canvas.width;
						}
			
						ths.context.translate(ths.drops[i][0], ths.drops[i][1]);
						ths.context.rotate(-ths.settings.wind * Math.PI / 90);
						//we draw this point at 0,0 because the context has already been translated to the position where we want to draw the drop
						ths.context.fillRect(0,0, ths.settings.dropWidth, ths.settings.dropHeight + (rand * 8)); //size of drop
					}
					else {
						ths.context.fillRect(ths.drops[i][0],ths.drops[i][1], ths.settings.dropWidth, ths.settings.dropHeight + (rand * 8));
					}
					ths.context.restore();
			
					rand += 0.2;
					if(rand > 1){
						rand = 0.2;
					}
					dd += 1;
					if(dd >= ths.dropDarkness.length){
						dd = 0;
					}
				}
				setTimeout(ths.functions.general.drawloop,40); //repeat
			}
		}
	};

	window.addEventListener('load', function() {
		ths.functions.canvas.init();
	},false);

	window.addEventListener('resize', function() {
		//don't resize immediately
		clearTimeout(ths.resize);
		ths.resize = setTimeout(ths.functions.general.resizeWindow,200);
	},false);
}
