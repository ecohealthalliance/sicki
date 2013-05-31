function Proposal (prop, stat) {
    var that = this;
    var upvote, downvote;

    this.id = prop.id;
    
    // The upvote button
    var up_src = (prop.voted == 1) ? 'upvote_green.png' : 'upvote.png';
    upvote = $ ('<img class="vote" src="/' + application + '/static/images/' + up_src + '" />').click (function () {
        $.ajax ({
            url: '/' + application + '/eid/upvote/' + prop.id,
            success: function () {
                upvote.attr ('src', '/' + application + '/static/images/upvote_green.png');
                downvote.attr ('src', '/' + application + '/static/images/downvote.png');
            }
        });
    });
    
    // The downvote button
    var down_src = (prop.voted == -1) ? 'downvote_red.png' : 'downvote.png';
    downvote = $ ('<img class="vote" src="/' + application + '/static/images/' + down_src + '" />').click (function () {
        $.ajax ({
            url: '/' + application + '/eid/downvote/' + prop.id,
            success: function () {
                upvote.attr ('src', '/' + application + '/static/images/upvote.png');
                downvote.attr ('src', '/' + application + '/static/images/downvote_red.png');
            }
        });
    });

    // The container for the proposal value
    var wrapper = $ ('<div>&nbsp;</div>');
    wrapper.append (upvote).append (downvote);
    wrapper.append (stat.template.html (prop.value));

    // The container for the references
    var refs =  $ ('<div class="refs"></div>');
    if (prop.refs.length > 0)
        refs.append ('<div class="subtitle">References</div>');
    $.each (prop.refs, function (i, ref) {
        refs.append ($ ('<div class="ref"></div>').text (ref.name));
    });

    var main = $ ('<div class="prop"></div>');
    main.append (wrapper).append (refs);

    // The admin controls. admin hits accept and ajax call is made to server to
    // save proposal
    var controls = $ ('<div></div>');
    var accept = $ ('<a class="control" href="#">Accept</a>"').click (function () {
        $.ajax ({
            url: '/' + application + '/eid/accept/' + prop.id,
            success: function () {
                // update client view with proposal
                stat.update (prop.value);
                // and remove now accepted proposal
                stat.remove_proposal (that.id);
                //main.remove ();
                //commit_value (prop.field, prop.value);
            }
        });

        return false;
    });
    // admin rejects
    var reject = $ ('<a class="control" href="#">Reject</a>"').click (function () {
        $.ajax ({
            url: '/' + application + '/eid/reject/' + prop.id,
            success: function () {
                stat.remove_proposal (that.id);
                //main.remove ();
            }
        });
        return false;
    });
    if (admin_role) {
        controls.append (accept).append (reject);
    }
    main.append (controls);

    this.append = function (selector) {
	$ (selector).append (main);
    };

    this.remove = function () {
	main.remove ();
    };
};