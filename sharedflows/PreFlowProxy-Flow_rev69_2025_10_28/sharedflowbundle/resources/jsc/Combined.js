var data=["queryparams","formparams","headers"];
//var pattern_code = "(.*Exception in thread.*)|(<\s*script\b[^>]*>[^<]+<\s*\/\s*script\s*>)|(<!--#(include|exec|echo|config|printenv)\\s+.*)|(/?(ancestor(-or-self)?|descendant(-or-self)?|following(-sibling)))";
var pattern_code="[\s]*((.*Exception in thread.*)|(<\s*script\b[^>]*>[^<]+<\s*\/\s*script\s*>)|(<!--#(include|exec|echo|config|printenv)\\s+.*)|(/?(ancestor(-or-self)?|descendant(-or-self)?|following(-sibling)))|(\bor\b))";
pattern_code = "\s*((Exception in thread)|(<\s*script\b[^>]*>[^<]+<\s*/\s*script\s*>)|(<!--#(?:include|exec|echo|config|printenv)\s+.*?)|(/?(?:ancestor(?:-or-self)?|descendant(?:-or-self)?|following(?:-sibling)?))|\bor\b)";

var pattern_sql="[\s]*((delete)|(exec)|(drop)|(insert)|(shutdown)|(update)|(\bor\b))";
pattern_sql = "\s*(?:delete|exec|drop|insert|shutdown|update|\bor\b)";


var pattern_code_new= /<\s*script\b[^>]*>[^<]+<\/\s*\s*script\s*>/gm;
pattern_code_new = /<\s*script\b[^>]*>.*?<\/\s*script\s*>/gm;

var pattern_code_iframe = /<\s*iframe\b[^>]*\/?>/gm;
pattern_code_iframe = /<\s*iframe\b[^>]*\/?\s*>/gm;

var pathsuffix = context.getVariable("proxy.pathsuffix");

code_injection();
sql_injection();

function code_injection() {
    var i=0;
    for(i=0;i<data.length;i++) {
        var list=context.getVariable("request."+data[i]+".names");
        if(list!==null) {
            var list_data=context.getVariable("request."+data[i]+".names").toArray();
            check_for_attack_code_new(list_data, data[i]);
            check_for_attack_code_iframe(list_data, data[i]);
            check_for_attack_code(list_data, data[i]);
        }
    }
}

function check_for_attack_code(list_data,data) {
    var j = 0;
    for(j=0;j<list_data.length;j++) {
        try {
            var val=context.getVariable("request."+data.replace("s","")+"."+list_data[j]);
            
            if(val.toString().toLowerCase().match(pattern_code)) {
                throw "error1";
            }
        }
        catch (err) {
            context.setVariable("cause","CodeInjectionParametersScript");
            throw "error1";
        } 
    }
}

function check_for_attack_code_new(list_data,data) {
    var j = 0;
    for(j=0;j<list_data.length;j++) {
        try {
            var val=context.getVariable("request."+data.replace("s","")+"."+list_data[j]);
            
            if(val.toString().toLowerCase().match(pattern_code_new)) {
                throw "error1";
            }
        }
        catch (err) {
            context.setVariable("cause","CodeInjectionParametersScript");
            throw "error1";
        } 
    }
}

function check_for_attack_code_iframe(list_data,data) {
    var j = 0;
    for(j=0;j<list_data.length;j++) {
        try {
            var val=context.getVariable("request."+data.replace("s","")+"."+list_data[j]);
            
            if(val.toString().toLowerCase().match(pattern_code_iframe)) {
                throw "error1";
            }
        }
        catch (err) {
            context.setVariable("cause","CodeInjectionParametersScript");
            throw "error1";
        } 
    }
}

function sql_injection() { 
    var i=0;
    for(i=0;i<data.length;i++) {
        var list=context.getVariable("request."+data[i]+".names");
        if(list!==null) {
        var list_data=context.getVariable("request."+data[i]+".names").toArray();
        
        check_for_attack_sql(list_data,data[i]);
        }
    }
}

function check_for_attack_sql(list_data,data) {
    var j = 0;
    for(j=0;j<list_data.length;j++) {
        try {
            var val=context.getVariable("request."+data.replace("s","")+"."+list_data[j]);
          
            if(val.toString().toLowerCase().match(pattern_sql)) {
                throw "error1";
            }
        }
        catch (err) {
            context.setVariable("cause","SQLInjectionParametersScript");
            throw "error1";
        } 
    }
}