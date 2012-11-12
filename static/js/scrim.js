function Scrim (zIndex) {
    var elem = $ ('<div</div>').css ({
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	'background-color': 'rgba(0,0,0,.75)',
	'z-index': 2,
	display: 'none'
    }).attr ({
	'id': 'scrm'
    });
    $ ('body').append (elem);

    this.show = function () {
	elem.css ('display', 'block');
	$ ('body').css ('overflow', 'hidden');
    };

    this.hide = function () {
	elem.css ('display', 'none');
	$ ('body').css ('overflow', '');
    };

    this.html = function () {
	return elem;
    };
};
