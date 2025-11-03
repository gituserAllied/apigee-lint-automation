try{
    var errorstr = "";
    var error = "";
    var request = {};
    var request = context.getVariable("DECODED_DECRYPTED_CONTENT") ? context.getVariable("DECODED_DECRYPTED_CONTENT") : context.getVariable("request.content");
    context.setVariable("impsstatusvalid", true);  
    

    var schema = "";
    schema = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "type": "object",
      "properties": {
        "transRefNo": {
          "type": "string",
           "pattern": "^[A-Za-z0-9-]{1,100}$",
        },
        "Date": {
          "type": "string",
           //"pattern": "^(0[1-9]|[12][0-9]|3[01])[\/](?:(0[1-9]|1[012])[\/](19|20)[0-9]{2})$"
        },
        "recon360": {
          "type": "string",
    	  "pattern":"^[y|n|Y|N]{1,1}$"
        },
        "passCode": {
          "type": "string",
           "pattern": "^[A-Za-z0-9]{1,100}$"
        },
        "bcID": {
          "type": "string",
           "pattern": "^[A-Za-z0-9]{1,100}$"
        }
      },
      "required": [
        "transRefNo",
        //"Date",
       // "recon360",
        "passCode",
        "bcID"
      ]
    };
    var data = JSON.parse(request);
    var opt = tv4.validate(data, schema);
    context.setVariable("impsstatusvalid", opt);
    if (opt === false) {
    context.setVariable("impsstatusvalidErrorType", "Invalid Data Type");
        context.setVariable("impsstatusvalidSchemaError", tv4.error.message);
    }
    
} catch (err) {
    context.setVariable("CATCH_EXCEPTION_200", err);
    context.setVariable("linenumber",err.lineNumber);
    throw err;
}