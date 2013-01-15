function Popup () {
    var map_object = function (func, ob) {
	new_ob = {};
	for (var key in ob) {
	    new_ob[key] = func (ob[key]);
	}
	return new_ob;
    };

    var scrim = new Scrim (2);

    var ref_list = new ReferenceList (application, $ ('#proposal-popup .query'), $ ('#proposal-popup .results'));

    this.show = function (field, stat) {
	var template = stat.template;
	
	// Show the scrim and the popup window
	var popup = $ ('#proposal-popup');
	popup.css ('display', 'block');
	scrim.show ();

	var main = $ ('#proposal-popup .proposal-main');

	var refs = $ ('#proposal-popup .refs');

	// Remove the previous input fields
	var edit = $ ('#proposal-popup .edit');
	edit.children ().remove ();
	edit.append ('<div class="title">' + field.label + '</div>');

	// Remove the old references
	ref_list.reset ();

	// Add the new input to the popup
	var input = template.input (stat.value ());
	edit.append (input);

	// Remove the old controls: We will need to rebind the targets of the callbacks
	var controls = $ ('#proposal-popup .controls');
	controls.children ().remove ();

	// The controls
	var cancel = $ ('<a href="#">Cancel</a>').addClass ('control').click (function () {
	    $ ('#proposal-popup').css ('display', 'none');
	    scrim.hide ();
	    return false;
	});
	var submit = $ ('<a href="#">Submit</a>').addClass ('control').click (function () {
	    var val = template.val (input);
	    var proposal = {
		id: null,
		value: val,
		//refs: JSON.stringify (ref_list.selected ()),
		refs: ref_list.selected (),
		date: new Date (),
		user: user_id,
		field: field.name,
		up: 0,
		down: 0,
		voted: 0,
		ratio: 1
	    };
	    $.ajax ({
		url: '/' + application + '/eid/propose/' + eid_id + '/' + field.name,
		type: 'POST',
		data: map_object (JSON.stringify, proposal),
		dataType: 'text',
		success: function (data) {
		    scrim.hide ();
		    $ ('#proposal-popup').css ('display', 'none');
		    //var num_props = field_proposals[field.name].length;
		    //show_props.text (num_props + ' Proposals');
		    if (admin_role) {
			stat.update (proposal.value);
		    }
		    else {
			proposal.id = data;
			stat.add_proposal (proposal);
		    }
		}
	    });
	    
	    return false;
	});
	controls.append (cancel).append (submit);

	// Set the dimensions of the popup with respect to the window
	var width = $ (window).width ();
	var height = $ (window).height ();

	popup.css ('left', width / 4 - 20);
	popup.css ('width', width / 2 + 40);

	popup.css ('top', height / 8);
	popup.css ('height', 3 * height / 4);

	main.css ('height',  3 * height / 4 - controls.innerHeight ());
	//controls.css ('width', width / 2);

	edit.css ('width', width / 4);

	refs.css ('min-height', edit.height ());
	refs.css ('margin-left', width / 4);
	

	// Hit the cancel button when the user clicks off the popup
	scrim.click (function () {
	    cancel.trigger ('click');
	    scrim.hide ();
	});
    };

};
