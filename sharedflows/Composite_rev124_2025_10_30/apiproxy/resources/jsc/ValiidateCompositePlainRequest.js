try{
    var priorityHeader = context.getVariable("request.header.x-priority");
    var apikey = context.getVariable("request.header.apikey");
    var beneflowcheck = context.getVariable("verifyapikey.VA-VerifyApiKey.BNF_Flow");
    var basepath = context.getVariable("proxy.basepath");
    var proxypathsuffix = context.getVariable("proxy.pathsuffix");
    var myreq = "";
    var config = {};
    config = JSON.parse(context.getVariable("private.merchantConfig"));
    context.setVariable("enableEncryption", config.enableEncryption);
    var requestContent = context.getVariable("DECODED_DECRYPTED_CONTENT")?context.getVariable("DECODED_DECRYPTED_CONTENT"):context.getVariable("request.content");
    var myreq = JSON.parse(requestContent);
    var run_schema  = "1";
    if(proxypathsuffix == "/status/imps"){
        run_schema  = "0";   
    }else if(proxypathsuffix == "/status/neft-rtgs"){
        run_schema  = "0";   
    }
    var neftschema1 = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Generated schema for Root",
      "type": "object",
      "properties": {
        "tranRefNo": {
          "type": "string",
          "pattern":"^[0-9a-zA-Z]{1,40}$"
          //"pattern":"^.{1,40}$"
        },
        "amount": {
          "type":  ["number","string"],
          "pattern":"^[0-9.]{1,18}$"
        },
        "senderAcctNo": {
          "type": "string",
          "pattern":"^[0-9a-zA-Z]{1,35}$"
        },
        "beneAccNo": {
          "type": "string",
          "pattern":"^[0-9a-zA-Z]{0,35}$"
        },
        "beneName": {
          "type": "string",
          "pattern":"^[a-zA-Z ]{1,80}$"
          //"pattern":"^.{1,80}$"
        },
        "beneIFSC": {
          "type": "string",
          "pattern":"^[0-9a-zA-Z]{1,11}$"
        },
        "narration1": {
          "type": "string",
          "pattern":"^[0-9a-zA-Z ]{1,140}$"
          //"pattern":"^(?!.*?--){1,140}$"
        },
        "narration2": {
          "type": "string",
          "pattern":"^(?!.*?--)[0-9a-zA-Z ]{0,50}$"
          //"pattern":"^(?!.*?--){0,140}$"
        },
        "crpId": {
          "type": "string",
          "pattern":"^[0-9a-zA-Z]{1,50}$"
          //"pattern":"^(?!.*?--){1,32}$"
        },
        "crpUsr": {
          "type": "string",
           "pattern":"^[0-9a-zA-Z]{1,50}$"
        //"pattern":"^(?!.*?--){1,32}$"
        },
        "aggrId": {
          "type": "string",
           "pattern":"^[0-9a-zA-Z]{1,100}$"
        //"pattern":"^(?!.*?--){1,100}$"
        },
        "urn": {
          "type": "string",
           "pattern":"^(?!.*--)[0-9a-zA-Z-_]{1,50}$"
        //"pattern":"^(?!.*?--){1,40}$"
        },
        "aggrName": {
          "type": "string",
           "pattern":"^[a-zA-Z]{1,50}$"
       // "pattern":"^(?!.*?--){1,32}$"
        },
        "txnType": {
          "type": "string",
          "pattern":"^[a-zA-Z]{1,3}$"
        },
        "WORKFLOW_REQD": {
          "type": "string",
          "pattern":"^[Y|N|y|n]{1,1}$"
        },
        "bnfId": {
            "type": "string",
            "pattern":"^(?!.*?--){0,100}$"
        },
        "BENLEI": {
            "type": "string",
            "pattern":"^(?!.*?--){0,20}$"
        }
      },
      "additionalProperties": false,
      "required": [
        "tranRefNo",
        "amount",
        "senderAcctNo",
        "beneAccNo",
        "beneName",
        "beneIFSC",
        "narration1",
        "crpId",
        "crpUsr",
        "aggrId",
        "urn",
        "aggrName",
        "txnType"
      ]
    };
    var impsschema = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Generated schema for Root",
      "type": "object",
      "properties": {
        "beneIFSC": {
          "type": "string",
          "pattern": "^[A-Za-z]{4}0[A-Za-z0-9]{6}$"
        },
        "beneAccNo": {
             "oneOf": [{
                "type": "string",
                "pattern": "^(?![_-]+$)[A-Za-z0-9]{0,35}$"
            },
            {
                "type": "null",
            },
            {
                "type": "number",
                "minimum":1,
                "maximum":99999999999999999999999999999999999,
            }]
        },
        "tranRefNo": {
             "oneOf": [{
                "type": "string",
                "pattern":"^(?!.*--)[A-Za-z0-9. -]{0,50}$"
            },
            {
                "type": "number",
                "minimum":1,
                "maximum":99999999999999999999999999999999999999999999999999,
            }]
        },
      }
    };
    
    var neftschema = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Generated schema for Root",
      "type": "object",
      "properties": {
       "beneIFSC": {
          "type": "string",
          "pattern": "^[A-Za-z]{4}0[A-Za-z0-9]{6}$"
        },
        "beneAccNo": {
             "oneOf": [{
                "type": "string",
                //"pattern":"^[^%]{0,35}$",
                "pattern": "^(?![_-]+$)[A-Za-z0-9]{0,35}$"
            },
            {
                "type": "null",
            },
            {
                "type": "number",
                "minimum":1,
                "maximum":99999999999999999999999999999999999,
            }]
        },
        "senderAcctNo": {
             "oneOf": [{
                "type": "string",
                "pattern": "^(?![_-]+$)[A-Za-z0-9]{0,35}$"
            },
            {
                "type": "null",
            },
            {
                "type": "number",
                "minimum":1,
                "maximum":99999999999999999999999999999999999,
            }]
        },
      }
    };
    
    var rtgsschema = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Generated schema for Root",
      "type": "object",
      "properties": {
       "IFSC": {
          "type": "string",
          "pattern": "^[A-Za-z]{4}0[A-Za-z0-9]{6}$"
        },
        "DEBITACC": {
             "oneOf": [{
                "type": "string",
                "pattern": "^(?![_-]+$)[A-Za-z0-9]{0,35}$"
            },
            {
                "type": "null",
            },
            {
                "type": "number",
                "minimum":1,
                "maximum":99999999999999999999999999999999999,
            }]
        },
        "CREDITACC": {
             "oneOf": [{
                "type": "string",
                "pattern": "^(?![_-]+$)[A-Za-z0-9]{0,35}$"
            },
            {
                "type": "null",
            },
            {
                "type": "number",
                "minimum":1,
                "maximum":99999999999999999999999999999999999,
            }]
        },
      }
    };
    var ineftschema = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Generated schema for Root",
      "type": "object",
      "properties": {
         "beneIFSC": {
          "type": "string",
          "pattern": "^[A-Za-z]{4}0[A-Za-z0-9]{6}$"
        },
        "beneAccNo": {
             "oneOf": [{
                "type": "string",
                "pattern": "^(?![_-]+$)[A-Za-z0-9]{0,35}$"
            },
            {
                "type": "null",
            },
            {
                "type": "number",
                "minimum":1,
                "maximum":99999999999999999999999999999999999,
            }]
        },
        "senderAcctNo": {
             "oneOf": [{
                "type": "string",
                "pattern": "^(?![_-]+$)[A-Za-z0-9]{0,35}$"
            },
            {
                "type": "null",
            },
            {
                "type": "number",
                "minimum":1,
                "maximum":99999999999999999999999999999999999,
            }]
        },
      }
    };
    var upischema = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Generated schema for Root",
      "type": "object",
      "properties": {
        "seq-no": {
            "type": ["string","number"],
            "minLength":35,
            "maxLength":35
        },
        "payee-va": {
            "type": "string",
            "pattern":"^[^%*#$!]{1,255}$",
        },
      }
    };
     var schema = "false";
    if(run_schema == "1"){
        if(apikey == "OqozMyt4PfcCT2hrpsQI8qSFz8oXmBA1"){
            switch (priorityHeader) {
                case "0100":
                    schema = impsschema;
                    break;
                case "0010":
                    schema = neftschema1;
                    break;
                
            }
        }else{
             switch (priorityHeader) {
                case "1000":
                schema = upischema;
                break;
                case "0100":
                schema = impsschema;
                break;
                case "0010":
                schema = neftschema;
                break;
                case "0001":
                schema = rtgsschema;
                break;
                case "ineft":
                schema = ineftschema;
                break;
            }
        }
        var priorityHeaderArray  = ["1000","0100","0010","0001","BULK","ineft","WFIMPS","0120"];
        var xpriorityfound = "";
        var invalidAmount = 0;
        xpriorityfound = priorityHeaderArray.indexOf(priorityHeader);
        if(priorityHeader == "0100" && myreq.hasOwnProperty("amount") && (myreq.amount > 500000 || myreq.amount < 1) ){
           invalidAmount = 1;
        }else if(priorityHeader == "WFIMPS" && myreq.hasOwnProperty("AMOUNT") && (myreq.AMOUNT > 500000 || myreq.AMOUNT < 1)){
           invalidAmount = 1;
        }else if(priorityHeader == "1000" && myreq.hasOwnProperty("amount") && (myreq.amount > 500000 || myreq.amount < 0.01)){
           invalidAmount = 1;
        }else if(priorityHeader == "0010" && myreq.hasOwnProperty("amount") && myreq.amount < 1){
           invalidAmount = 1;
        }else if(priorityHeader == "0001" && myreq.hasOwnProperty("AMOUNT") && myreq.AMOUNT < 200000 && myreq.hasOwnProperty("TXNTYPE") && myreq.TXNTYPE.toLowerCase() == 'rtg') {
                invalidAmount = 1;
        }else if(priorityHeader == "ineft" && myreq.hasOwnProperty("amount") && myreq.amount < 1){
           invalidAmount = 1;
        }
        if(invalidAmount == 1){
           var plainErrorMessage = {"success": "False",  "response" : 8097, "errormessage" : "Invalid Amount"};
            context.setVariable("plainErrorMessage", JSON.stringify(plainErrorMessage));
            context.setVariable("plainReqError", false);
            setError("Invalidamount", "Invalidamount");
            throw "Invalidamount";
        }else if(xpriorityfound == -1){
            var plainErrorMessage = {"success": "False",  "response" : 8096, "errormessage" : "Invalid Request"};
                context.setVariable("plainErrorMessage", JSON.stringify(plainErrorMessage));
            context.setVariable("plainReqError", false);
            setError("Invalidrequest", "Invalidrequest");
            throw "Invalidrequest";
        }else if(!checkIfEmpty(myreq.beneAccNo) && !checkIfEmpty(myreq.bnfId) && priorityHeader == "0010"){
            context.setVariable("plainReqError", false);
            setError("Invalidrequest", "Invalidrequest");
            throw "Invalidrequest";
    	}else if(!checkIfEmpty(myreq.beneAccNo) && !checkIfEmpty(myreq.bnfId) && priorityHeader == "ineft"){
            context.setVariable("plainReqError", false);
            setError("Invalidrequest", "Invalidrequest");
            throw "Invalidrequest";
    	}else if(!checkIfEmpty(myreq.CREDITACC) && !checkIfEmpty(myreq.BNFID) && priorityHeader == "0001"){
            context.setVariable("plainReqError", false);
            setError("Invalidrequest", "Invalidrequest");
            throw "Invalidrequest";
    	}else if(schema!="false"){
            var data = myreq;
            var opt = tv4.validate(data, schema);
            context.setVariable("plainReqError", opt);
            if (opt === false) {
                var plainErrorMessage = {"success": "False",  "response" : 8096, "errormessage" : "Invalid Request"};
                context.setVariable("plainErrorMessage", JSON.stringify(plainErrorMessage));
                context.setVariable("ErrorType", "Invalid Data Type");
                context.setVariable("SchemaError", tv4.error.message);
                context.setVariable("linenumber",tv4.error.schemaPath);
                context.setVariable("Field",tv4.error.dataPath);
                context.setVariable("Code",tv4.error.code);
                context.setVariable("SchemaError dataPath", tv4.error.dataPath);
                setError("Invalidrequest", "Invalidrequest");
                throw "Invalidrequest";
            }
        }
    }
}catch(err){
    context.setVariable("CATCH_EXCEPTION", "Plain Request error: " + err);
}
function setError(err, cause) {
    context.setVariable("cause", cause);
    context.setVariable("faultName", "ScriptExecutionFailed");
    throw err;
}
function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}