function Statistic (field, field_proposals, field_value) {
    var that = this;

    var field_name = field.name;
    var template = Template (field);
    this.template = template;

    // The container for the whole object
    var stat;
    this.addClass = function (classname) {
	stat.addClass (classname);
    }

    
    var wrapper;
    var value = null;
    this.value = function () {
	return value;
    };
    this.update = function (_value) {
	value = _value;
	wrapper.children ().remove ();
	wrapper.append (template.html (value));
    };

    var props, prop_title;
    var num_props = 0;
    var proposals = {};
    this.add_proposal = function (proposal) {
	prop_title.css ('display', 'block');
	var new_prop = new Proposal (proposal, this);
	proposals[proposal.id] = new_prop;
	new_prop.append (props);
	num_props ++;
	recount_proposals ();
    };

    this.remove_proposal = function (id) {
	proposals[id].remove ();
	delete proposals[id];
	num_props --;
	if (!num_props)
	    prop_title.css ('display', 'none');
	recount_proposals ();
    }

    // Controls for showing the proposals
    var show_props;
    var recount_proposals = function () {
	show_props.text (num_props + ' Proposals');
    };

    // Add the statistic to the document
    this.append = function (selector) {
	$ (selector).append (stat);
    };

    var stat = $ ('<div></div>').addClass ('statistic').attr ('id', field_name);
    stat.append (format_label (field));

    // The main body for each statistic
    var main = $ ('<div class="main"></div>');
    stat.append (main);

    // The controls container for the statistic
    var controls = $ ('<div></div>').addClass ('controls');

    // The control for showing the proposals
    show_props = $ ('<a href="#"></a>').addClass ('control').click (function () {
	props.toggle (400);
	return false;
    });
    recount_proposals ();

    // The control for adding a proposal
    var add_prop = $ ('<a href="#"></a>').text ('Add Proposal').addClass ('control').click (function () {
	popup.show (field, that);
	//format_popup (field, props, show_props);
	return false;
    });
    controls.append (show_props).append (add_prop);
    
    // The div wrapper of the value
    wrapper = $ ('<div>&nbsp;</div>').addClass ('value');
    this.update (field_value);
    main.append (wrapper);

    // An container to place outstanding proposals as needed
    props = $ ('<div></div>').addClass ('proposals');
    prop_title = $ ('<div class="subtitle">Proposals</div>').css ('display', 'none');
    props.append (prop_title);
    $.each (field_proposals, function (k, proposal) {
	that.add_proposal (proposal);
    });
    main.append (props).append (controls);
};
