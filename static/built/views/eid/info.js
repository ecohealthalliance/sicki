define(['jade'],function(jade){return function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),Model = locals_.Model;// iterate Model.fields
;(function(){
  var $$obj = Model.fields;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var field = $$obj[$index];

buf.push("<div" + (jade.attrs({ "class": [(field.name)] }, {"class":true})) + "></div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var field = $$obj[$index];

buf.push("<div" + (jade.attrs({ "class": [(field.name)] }, {"class":true})) + "></div>");
    }

  }
}).call(this);
;return buf.join("");
}})