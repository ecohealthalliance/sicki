$ (document).ready (function () {
    $ ('#sort_events').change (function () {
	var val = $ (this).val ();
	var base = '{{= URL (r = request) }}';
	if (val.length)
	    base += '?sort=' + val
	window.location.href = base;
});