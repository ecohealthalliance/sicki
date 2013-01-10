$ (document).ready (function () {
    $ ('#sort_events').change (function () {
	var val = $ (this).val ();
	var base = window.location.origin + window.location.pathname;
	if (val.length)
	    base += '?sort=' + val;
	window.location.href = base;
    });
});