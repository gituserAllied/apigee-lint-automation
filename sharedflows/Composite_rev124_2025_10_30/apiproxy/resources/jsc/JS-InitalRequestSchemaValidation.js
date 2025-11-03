var requestContent = context.getVariable("DECODED_DECRYPTED_CONTENT") ? context.getVariable("DECODED_DECRYPTED_CONTENT") : context.getVariable("request.content");
context.setVariable("request.content", requestContent);  
var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
var request_verb = context.getVariable("request.verb");
var haeder_origin = context.getVariable("request.header.Origin");

try{
    var schema = "";
    schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "requestId": {
                "type": "string",
                // "pattern":"^[0-9a-zA-Z]{0,50}$|^$"
            },
            "service": {
                "type": "string",
                "pattern":"^(?!.*?--)[1-9a-zA-Z_-]{0,1}[0-9a-zA-Z-_]{0,100}$|^$"
            },
            "encryptedKey": {
                "type": "string"
            },
            "oaepHashingAlgorithm": {
                "type": "string",
                "pattern":"^(?!.*?--)[1-9a-zA-Z]{0,1}[0-9a-zA-Z-]{0,100}$|^$"
            },
            "iv": {
                "type": "string"
            },
            "encryptedData": {
                "type": "string"
            },
            "clientInfo": {
                "type": "string",
                "pattern":"^(?!.*?--)[1-9a-zA-Z]{0,1}[0-9a-zA-Z-]{0,100}$|^$"
            },
            "optionalParam": {
                "type": "string",
                "pattern":"^(?!.*?--)[a-zA-Z0-9 _-]{0,50}$"
            }
        },
        "required": [
            "encryptedKey",
            "encryptedData"
        ]
    };
    var checkurl =context.getVariable("proxy.url");
    var urlparams = checkurl.split('?');
    if(urlparams.length > 1){
        context.setVariable("ErrorType", "Invalid URL");
        context.setVariable("valid", false);
    }else if(!checkIfEmpty(haeder_origin)){
        // context.setVariable("ErrorType", "Invalid Origin");
        // context.setVariable("valid", false);
    }else{
        var data = JSON.parse(requestContent);
        var opt = tv4.validate(data, schema);
        context.setVariable("valid", opt);
        if (opt === false) {
            context.setVariable("ErrorType", "Invalid Data Type");
            context.setVariable("SchemaError", tv4.error.message);
            validJson();
        }
    }
}catch (err) {
    context.setVariable("CATCH_EXCEPTION_200", err);
    context.setVariable("linenumber",err.lineNumber);
    throw err;
}
function validJson() {
    var finalResponse = {
        "success": false,
        "errorcode": "400",
        "errormessage": "Mandatory Field is Missing"

    };
}
function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}