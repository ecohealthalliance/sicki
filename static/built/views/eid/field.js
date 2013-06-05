define(['jade'],function(jade){return function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),block = locals_.block,attributes = locals_.attributes,escaped = locals_.escaped,field = locals_.field,text_mixin = locals_.text_mixin,model = locals_.model;var textField_mixin = function(field, value){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push("<div><span class=\"name\">" + (jade.escape(null == (jade.interp = field.name + ': ') ? "" : jade.interp)) + "</span><span class=\"value\">" + (jade.escape(null == (jade.interp = value) ? "" : jade.interp)) + "</span></div><div class=\"edit\"><input" + (jade.attrs({ 'value':(value) }, {"value":true})) + "/></div>");
};
buf.push("<div>");
if ( field.type == 'text' || field.type === undefined)
{
text_mixin(field, model[field.name]);
}
buf.push("</div>");;return buf.join("");
}})