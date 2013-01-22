$ (document).ready (function () {

    var pending =  {{ response.write (json.dumps (pending), escape = False) }};
    proposals_html(pending,$('#pending');
    var accepted =  {{ response.write (json.dumps (pending), escape = False) }};
    var pending =  {{ response.write (json.dumps (pending), escape = False) }};
    
});

// take a list of proposals, make html for them and put html into div
function proposals_html(proposals,div) {

    div.append("testing");
    alert("????");
}