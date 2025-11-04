try{
    var proxyBasePath = context.getVariable("proxy.basepath");
    var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
    var requestContent = context.getVariable("DECODED_DECRYPTED_CONTENT")?context.getVariable("DECODED_DECRYPTED_CONTENT"):context.getVariable("request.content");
    var requestContent = context.getVariable("request.content");
    var requestPayload = JSON.parse(requestContent);
    
    
//========================== Schema Validation ===========================================    


var getCVMSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "tokenRequestorID": {
      "type": "integer",
      "pattern":"^[0-9]+$"
    },
    "tokenReferenceID": {
      "type": "string",
      "pattern":"^[A-Za-z0-9]+$"
    },
    "panReferenceID": {
      "type": "string",
      "pattern":"^[A-Za-z0-9-]+$"
    },
    "lifeCycleTraceID": {
      "type": "integer",
      "pattern":"^[0-9]+$"
    },
    "clientWalletAccountID": {
      "type": "string",
      "pattern":"^[A-Za-z0-9]+$"
    },
    "otpReason": {
      "type": "string",
      "pattern":"^[A-Za-z]+$"
    },
    "otpMaxReached": {
      "type": "boolean"
    },
    "deviceInfo": {
      "type": "object",
      "properties": {
        "deviceID": {
          "type": "string",
          "pattern":"^[A-Za-z0-9_]+$"
        },
        "deviceType": {
          "type": "string",
          "pattern":"^[A-Za-z_]+$"
        }
      },
      "required": [
        "deviceID",
        "deviceType"
      ]
    },
    "encryptedData": {
      "type": "string"
    }
  },
  "required": [
    "tokenRequestorID",
    "tokenReferenceID",
    "panReferenceID",
    "lifeCycleTraceID",
    "clientWalletAccountID",
    "otpReason",
    "otpMaxReached",
    "deviceInfo",
    "encryptedData"
  ]
};



var sendPasscodeSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "tokenRequestorID": {
      "type": "integer",
      "pattern":"^[0-9]+$"
    },
    "tokenReferenceID": {
      "type": "string",
      "pattern":"^[A-Za-z0-9]+$"
    },
    "panReferenceID": {
      "type": "string",
      "pattern":"^[A-Za-z0-9-]+$"
    },
    "lifeCycleTraceID": {
      "type": "integer",
      "pattern":"^[0-9]+$"
    },
    "clientWalletAccountID": {
      "type": "string",
      "pattern":"^[A-Za-z0-9]+$"
    },
    "otpMethodIdentifier": {
      "type": "string",
      "pattern":"^[A-Za-z0-9]+$"
    },
    "otpValue": {
      "type": "string",
      "pattern":"^[0-9]+$"
    },
    "otpExpirationDate": {
      "type": "string",
      "pattern":"^(?!.*--)[A-Za-z0-9-:.]+$"
    },
    "deviceInfo": {
      "type": "object",
      "properties": {
        "deviceID": {
          "type": "string",
          "pattern":"^(?!.*--)[A-Za-z0-9]+$"
        },
        "deviceType": {
          "type": "string",
          "pattern":"^[A-Za-z_]+$"
        }
      },
      "required": [
        "deviceID",
        "deviceType"
      ]
    },
    "encryptedData": {
      "type": "string"
    }
  },
  "required": [
    "tokenRequestorID",
    "tokenReferenceID",
    "panReferenceID",
    "lifeCycleTraceID",
    "clientWalletAccountID",
    "otpMethodIdentifier",
    "otpValue",
    "otpExpirationDate",
    "deviceInfo",
    "encryptedData"
  ]
};
        
        
var checkEligibilitySchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "tokenRequestorID": {
      "type": "integer",
      "pattern":"^[0-9]+$"
    },
    "tokenReferenceID": {
      "type": "string",
      "pattern":"^[A-Za-z0-9]+$"
    },
    "panReferenceID": {
      "type": "string",
      "pattern":"^[A-Za-z0-9-]+$"
    },
    "panSource": {
      "type": "string",
      "pattern":"^[A-Za-z0-9_]+$"
    },
    "lifeCycleTraceID": {
      "type": "integer",
      "pattern":"^[0-9]+$"
    },
    "deviceInfo": {
      "type": "object",
      "properties": {
        "deviceID": {
          "type": "string"
        },
        "deviceLanguageCode": {
          "type": "string",
          "pattern":"^[A-Za-z]+$"
        }
      },
      "required": [
        "deviceID",
        "deviceLanguageCode"
      ]
    },
    "encryptedData": {
      "type": "string"
    }
  },
  "required": [
    "tokenRequestorID",
    "tokenReferenceID",
    "panReferenceID",
    "panSource",
    "lifeCycleTraceID",
    "deviceInfo",
    "encryptedData"
  ]
};


        
var schema;
    
    switch (proxyPathSuffix) {
		case "/retrieveStepUpMethods":
            schema = getCVMSchema;
            break;
		case "/sendPasscode":
            schema = sendPasscodeSchema;
            break;
        case "/checkEligibility":
            schema = checkEligibilitySchema;
            break;
    }
            
// ========================= Validation Schema ==============================   
    
    if(schema) {
        var isSchemaValid = tv4.validate(requestPayload, schema);
        context.setVariable("isSchemaValid", isSchemaValid);
        if(isSchemaValid === false) {
            context.setVariable("SchemaError", tv4.error.message);
        }   
    } else {
        context.setVariable("isSchemaValid", "true");
    }
} catch (err) {
    context.setVariable("CATCH_EXCEPTION", err);
} 

