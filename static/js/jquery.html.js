(function ($) {

    $.div = function (children, attr) {
	var elem = $ (document.createElement ('div'));
	if (children)
	    elem.append (children);
	if (attr)
	    elem.attr (attr);
	return elem;
    };

}) (jQuery);
