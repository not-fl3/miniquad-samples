var ctx=null;js_objects={}
unique_js_id=0
register_plugin=function(importObject){importObject.env.js_create_string=function(buf,max_len){var string=UTF8ToString(buf,max_len);return js_object(string);}
importObject.env.js_create_object=function(){var object={};return js_object(object);}
importObject.env.js_set_field_f32=function(js_object,buf,max_len,data){var field=UTF8ToString(buf,max_len);js_objects[js_object][field]=data;}
importObject.env.js_unwrap_to_str=function(js_object,buf,max_len){var str=js_objects[js_object];var utf8array=toUTF8Array(str);var length=utf8array.length;var dest=new Uint8Array(wasm_memory.buffer,buf,max_len);for(var i=0;i<length;i++){dest[i]=utf8array[i];}}
importObject.env.js_string_length=function(js_object){var str=js_objects[js_object];return toUTF8Array(str).length;}
importObject.env.js_free_object=function(js_object){console.log("deleting!")
delete js_objects[js_object];}
importObject.env.js_field=function(js_object,buf,length){var field_name=UTF8ToString(buf,length);var field=js_objects[js_object][field_name];var id=unique_js_id
js_objects[id]=field
unique_js_id+=1;return id;}}
miniquad_add_plugin({register_plugin});function toUTF8Array(str){var utf8=[];for(var i=0;i<str.length;i++){var charcode=str.charCodeAt(i);if(charcode<0x80)utf8.push(charcode);else if(charcode<0x800){utf8.push(0xc0|(charcode>>6),0x80|(charcode&0x3f));}
else if(charcode<0xd800||charcode>=0xe000){utf8.push(0xe0|(charcode>>12),0x80|((charcode>>6)&0x3f),0x80|(charcode&0x3f));}
else{i++;charcode=0x10000+(((charcode&0x3ff)<<10)|(str.charCodeAt(i)&0x3ff))
utf8.push(0xf0|(charcode>>18),0x80|((charcode>>12)&0x3f),0x80|((charcode>>6)&0x3f),0x80|(charcode&0x3f));}}
return utf8;}
function js_object(obj){var id=unique_js_id;js_objects[id]=obj;unique_js_id+=1;return id;}
function consume_js_object(id){var object=js_objects[id];delete js_objects[id];return object;}
function get_js_object(id){return js_objects[id];}