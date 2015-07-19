Weather
=======

A plugin to add weather effects to a webpage. Note: this plugin is unfinished and experimental. I wouldn't recommend using it for anything important yet.

Usage
-----

```html
<div class="w-wrapper" id="weather">
    <img src="background.jpg"/>
</div>

<script>
    $(document).ready(function(){
        $('#weather').weather();
    });
</script>
```

Note that either the height of the element must be set in CSS or determined by an image inside it. CSS is unfinalised.


Options
-------

- dropDensity: density of drops, defaults to 5
- colour: can be a hex value or a string e.g. 'green' or '#000000'
- speed: speed of drop fall, defaults to 15
- wind: causes the drops to fall at an angle. 0 for no wind (falls straight) or accepts any positive or negative number, up to a sensible amount, anything beyond 20 just flies across the screen. Generally a higher wind speed looks better with a higher speed.
- dropwidth: defaults to 1, not really worth changing
- dropheight: defaults to 4, not really worth changing
