sicki.views.eid={};sicki.views.eid.info = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),eidEvent = locals_.eidEvent;// iterate eidEvent
;(function(){
  var $$obj = eidEvent;
  if ('number' == typeof $$obj.length) {

    for (var key = 0, $$l = $$obj.length; key < $$l; key++) {
      var value = $$obj[key];

buf.push("<div class=\"key\">" + (jade.escape(null == (jade.interp = key + ': ' + value) ? "" : jade.interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var key in $$obj) {
      $$l++;      var value = $$obj[key];

buf.push("<div class=\"key\">" + (jade.escape(null == (jade.interp = key + ': ' + value) ? "" : jade.interp)) + "</div>");
    }

  }
}).call(this);
;return buf.join("");
};sicki.views.main = function anonymous(locals) {
var buf = [];
buf.push("<div id=\"main\"></div>");;return buf.join("");
};