var requestContent = context.getVariable("DECODED_DECRYPTED_CONTENT") ? context.getVariable("DECODED_DECRYPTED_CONTENT") : context.getVariable("request.content");
context.setVariable("request.content", requestContent);  
var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
var request_verb = context.getVariable("request.verb");
try{
    var auth = context.getVariable("request.header.Authorization");
    context.setVariable("auth",auth);
}
catch(e){
    
}

try{
    
var schema = "";
  if (request_verb == "POST") {
        schema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "additionalProperties":false,
  "properties": {
    "requestId": {
      "type": "string",
        "pattern":"^[0-9a-zA-Z ._-]{0,100}$"
      //"pattern":"/^[0-9a-zA-Z]+[0-9a-zA-Z-]*{0,1000}$/"
    //   "pattern":"/^[1-9]+[0-9a-zA-Z-]*$/"
     //"pattern":"/[0-9]{1}[0-9a-fA-F-]{1,100}$|^$|^\s$/"
    // "pattern":"^[A-Za-z0-9- ]{1,20}$|^$|^\s$"
      
    },
    "service": {
      "type": "string",
      "pattern":"^(?!.*?--)[1-9a-zA-Z_-]{0,1}[0-9a-zA-Z-_]{0,100}$|^$"
    },
    "encryptedKey": {
      "type": "string",
      "pattern":"^[0-9A-Za-z+/=]+$"
    },
    "oaepHashingAlgorithm": {
      "type": "string",
      "pattern":"^(?!.*?--)[1-9a-zA-Z]{0,1}[0-9a-zA-Z-]{0,100}$|^$"
    },
    "iv": {
      "type": "string"
    },
    "encryptedData": {
      "type": "string",
      "pattern":"^[0-9A-Za-z+/=]+$"
    },
    "clientInfo": {
      "type": "string",
    //   "pattern":"^(?!.*?--)[a-zA-Z0-9 _-]{0,50}$"
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

 var data = JSON.parse(requestContent);
    var opt = tv4.validate(data, schema);
    context.setVariable("valid", opt);
    if (opt === false) {
    context.setVariable("ErrorType", "Invalid Data Type");
        context.setVariable("SchemaError", tv4.error.message);
        validJson();
    }
    
  }
if (request_verb === "POST" || request_verb === "GET")
    {
    print("success") 
    }
    else
    {
        context.setVariable("ErrorType", "Invalid Method");
        // context.setVariable("SchemaError", tv4.error.message);
        WrongMethod();
    }


} catch (err) {
    context.setVariable("CATCH_EXCEPTION", err);
    context.setVariable("linenumber",err.lineNumber);
    var finalResponse = {
        "success": false,
        "errorcode": "400",
        "errormessage": "Invalid json"

    };
    
   throw JSON.stringify(finalResponse);
   
    throw err;
}
function WrongMethod() {
    var finalResponse = {
        "success": false,
        "errorcode": "405",
        "errormessage": "Invalid Method"

    };
}

function validJson() {
    var finalResponse = {
        "success": false,
        "errorcode": "400",
        "errormessage": "Mandatory Field is Missing"

    };
    
   throw JSON.stringify(finalResponse);
     
}

// /[^a-zA-Z0-9- ]/g, ''
// "pattern":"^[0-9a-zA-Z]{0,100}$

// "pattern":"^[0-9a-zA-Z-]{0,50}$"