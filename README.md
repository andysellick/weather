Weather
=======

A plugin to add a rain effect to an element. Options can be passed to control rain appearance. Multiple instances of the plugin on the same page with different configurations are supported.

Note: this plugin no longer has any jQuery dependence.

Usage
-----

Include the script and do the following.

```html
<div id="weather">
    <img src="background.jpg"/>
</div>

<script>
	var options = {
		speed: 4,
		dropDensity: 10,
		wind: 0
	};
	new weatherObj(document.getElementById('weather'),options);
</script>
```

Note that either the height of the parent element must be set in CSS or determined by the content inside it.


Options
-------

- **dropDensity**: density of drops, defaults to 40
- **dropDarkness**: general darkness of drops, is an rgba value, can be anything from 0 to 1 (although 0 would be invisible), defaults to 0.5
- **speed**: speed of drop fall, defaults to 15
- **wind**: causes the drops to fall at an angle. 0 for no wind (falls straight) or accepts any positive or negative number, up to a sensible amount, anything beyond 20 just flies across the screen. Generally a higher wind speed looks better with a higher speed. Defaults to -5.
- **dropWidth**: defaults to 1, not really worth changing
- **dropHeight**: defaults to 2, not really worth changing (drop size is varied automatically to create a depth illusion)
- **dropColor**: colour of drops, should be rgb array, defaults to [0,0,0] i.e. black drops

Demo here: http://www.custarddoughnuts.co.uk/article/2015/7/20/plugin-month-weather
