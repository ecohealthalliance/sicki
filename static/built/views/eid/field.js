define(['jade'],function(jade){return function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),field = locals_.field,model = locals_.model;buf.push("<div><span class=\"name\">" + (jade.escape(null == (jade.interp = field.name + ': ') ? "" : jade.interp)) + "</span><span class=\"value\">" + (jade.escape(null == (jade.interp = model.get(field.name)) ? "" : jade.interp)) + "</span></div>");;return buf.join("");
}})