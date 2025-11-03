context.setVariable("currentSharedFlow", context.getVariable("apigee.edge.sharedflow.name"));
var flowState = "UNKNOWN";
    
try {
    var faultName = context.getVariable("fault.name");
    var host = context.getVariable("virtualhost.aliases");
    var requestPath = context.getVariable("request.path");
    var httpProtocol = context.getVariable("request.header.X-Forwarded-Proto");
    var url = httpProtocol + "://" + host[0] + requestPath;
    var proxy = context.getVariable("apiproxy.name");
    var pathsuffix = context.getVariable("proxy.pathsuffix");
    
    var responseBody, statusCode, encryptionFlag, message, responseCode, contentType, reasonPhrase;
    var response= context.getVariable("finalResponse");
    
    if(response !== "" && response !== undefined && response !== null){
       responseBody = response;
        statusCode = 200;
        contentType = "json";
        encryptionFlag = true;
        flowState = "EXECUTION_COMPLETE";  
        
    }
    else if (faultName === "FailedToResolveAPIKey" || faultName === "InvalidApiKey" || faultName === "InvalidApiKeyForGivenResource" || faultName === "IPDeniedAccess") {
		responseBody = '{"success": "False","response": 401,"errormessage": "Unauthorized"}';
        statusCode = 401;
        contentType = "plaintext";
        encryptionFlag = false;
        flowState = "INVALID_IP/API_KEY";
    }
//     else if(faultName === "IPDeniedAccess") {
// 			responseBody = '{"success": "False","response": 401,"errormessage": "Unauthorize"}';
//             statusCode = 401;
//             contentType = "plaintext";
//             encryptionFlag = false;
//             flowState = "INVALID_IP/API_KEY";
//         }
    else if(faultName === "SpikeArrestViolation" || faultName === "QuotaViolation") {
		responseBody = '{"success": "False","response": 429,"errormessage": "Too Many Requests"}';
        statusCode = 429;
        contentType = "plaintext";
        encryptionFlag = false;
        flowState = "TOO_MANY_REQUESTS";
    }
    else if(faultName === "ExecutionFailed") {
        if (context.getVariable("jsonattack.failed") || context.getVariable("xmlattack.failed")) {
			responseBody = '{"success": "False","response": 403,"errormessage": "Forbidden PNOC Security Alert: Document Structure Threat Detected"}';
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "THREAT_DETECTED";
        }
        else {
			responseBody = '{"success": "False","response": 501,"errormessage": "System had Internal Error"}';
            statusCode = 501;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "EXECUTION_FAILED";
        }
    }
    else if(faultName === "RaiseFault") {
        var cause = context.getVariable("cause");
        if (cause == "SchemaValidationError") {
			responseBody = '{"success": "False",  "response" : 8096, "errormessage" : "Invalid Request"}';
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "THREAT_DETECTED";
        }
    else if(cause === "Invalidrequest") {
            responseBody = '{"success": "False",  "response" : 8096, "errormessage" : "Invalid Request"}';
            statusCode = 200;
            contentType = "json";
            encryptionFlag = true;
            flowState = "MISSING_MANDATORY_FIELDS";
        }
    }    
    else if(faultName === "ScriptExecutionFailed") {
        var cause = context.getVariable("cause");
        if (cause == "CodeInjectionParametersScript") {
			responseBody = '{"success": "False","response": 403,"errormessage": "Forbidden PNOC Security Alert: SQL Attack Detected"}';
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "THREAT_DETECTED";
        }
        else if(cause === "Invalidrequest") {
            responseBody = '{"success": "False",  "response" : 8096, "errormessage" : "Invalid Request"}';
            statusCode = 200;
            contentType = "json";
            encryptionFlag = true;
            flowState = "MISSING_MANDATORY_FIELDS";
        }
        else if(cause === "BeneLEINotEntered") {
            responseBody = '{"success": "False", "response" : 8098, "errormessage" : "Amount of more than 50 Cr cannot be processed as BeneLEI is not entered"}';
            statusCode = 200;
            contentType = "json";
            encryptionFlag = true;
            flowState = "MISSING_MANDATORY_FIELDS";
        }
         else if(cause === "BeneLEIIncorrect") {
            responseBody = '{"success": "False","response" : 8097, "errormessage" : "Entered BENLEI is incorrect"}';
            statusCode = 200;
            contentType = "json";
            encryptionFlag = true;
            flowState = "MISSING_MANDATORY_FIELDS";
        }
        else if(cause === "SQLInjectionParametersScript") {
			responseBody = '{"success": "False","response": 403,"errormessage": "Forbidden PNOC Security Alert: SQL Attack Detected"}';
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "THREAT_DETECTED";
        }
        else if(cause === "invalidParams") {	
			responseBody = '{"success": "False","response": 501,"errormessage": "System had Internal Error"}';
            statusCode = 501;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "INVALID_PARAMS";
        }
        else if(cause === "MissingNodalFields") {
            responseBody = '{"success": "False","response":"999","errormessage":"Beneficiary validation credentials missing"}';
            statusCode = 200;
            contentType = "json";
            encryptionFlag = true;
            flowState = "MISSING_NODAL_FIELDS";
        }
    	else if(cause === "LengthOfSettlementIDExceeded") {
        responseBody = '{"success": "False","response":"997","errormessage":"Length of the SettlementID exceeded 50 characters"}';
        statusCode = 400;
        contentType = "json";
        encryptionFlag = true;
        flowState = "LENGTH_OF_FIELD_VALUE_EXCEEDED";
        }
        else if(cause === "MissingMandatoryFieldsResponse") {
        responseBody = '{"success": "False","response":"42005","errormessage":"Invalid Beneficiary Selection. Please enter a valid input to proceed."}';
        statusCode = 200;
        contentType = "json";
        encryptionFlag = true;
        flowState = "MissingMandatoryFieldsResponse";
        }
        else if(cause === "MissingMandatoryFields") {
             if(context.getVariable("request.header.x-priority") === "0100")
                responseBody = '{"success": "False","response": 8015,"errormessage": "Mandatory field missing"}';
             else
                responseBody = '{"success": "False","response": 8015,"errormessage": "Mandatory field missing"}';
            statusCode = 200;
            contentType = "json";
            encryptionFlag = true;
            flowState = "MISSING_MANDATORY_FIELDS";
        }
        else if(cause === "BeneficiaryValidationFailed" || cause === "AllBackendsDown") {
            if(context.getVariable("calloutURL") === "api/v1/local/composite/imps")
                responseBody = '{"success":false,"errorCode":"997","description":"Note : Initaite Status check after Some time"}';
            else
               responseBody = '{"success":false,"errorCode":"997","description":"Note : Initaite Status check after Some time"}';
            statusCode = 200;
            contentType = "json";
            encryptionFlag = true;
            if(cause === "BeneficiaryValidationFailed")
                flowState = "BENEFICIARY_VALIDATION_FAILED";
            else if(cause === "AllBackendsDown")
                flowState = "ALL_BACKENDS_DOWN";
        }
        else if(cause === "InvalidMaxAmount") {
            responseBody = '{"success": "False","response":"8123","errormessage":"Configured amount limit exceeded"}';
            statusCode = 200;
            contentType = "json";
            encryptionFlag = true;
            flowState = "MISSING_NODAL_FIELDS";
        }
		else if(cause === "AuthenticationError"){
			var priorityHeader = context.getVariable("request.header.x-priority");
			if (priorityHeader === "1000"){
			responseBody = '{"success": "False","response":"8021","description":"Authentication Error. Non whitelisted PROFILE-ID"}';
            statusCode = 400;
            contentType = "json";
            encryptionFlag = true;
            flowState = "AUTHENTICATION ERROR";
			}
			else if (priorityHeader === "0100"){
			responseBody = '{"success": "False","response":"8021","description":"Authentication Error. Non whitelisted BCID"}';
            statusCode = 400;
            contentType = "json";
            encryptionFlag = true;
            flowState = "AUTHENTICATION ERROR";
			}
			else if (priorityHeader === "0010"){
			responseBody = '{"success": "False","response":"8021","description":"Authentication Error. Non whitelisted AGGRID"}';
            statusCode = 400;
            contentType = "json";
            encryptionFlag = true;
            flowState = "AUTHENTICATION ERROR";
			}
			else if (priorityHeader === "0001"){
			responseBody = '{"success": "False","response":"8021","description":"Authentication Error. Non whitelisted AGGRID"}';
            statusCode = 400;
            contentType = "json";
            encryptionFlag = true;
            flowState = "AUTHENTICATION ERROR";
			}
			else if (priorityHeader === "0120"){
			responseBody = '{"success": "False","response":"8021","description":"Authentication Error. Non whitelisted BCID or AGGRID"}';
            statusCode = 400;
            contentType = "json";
            encryptionFlag = true;
            flowState = "AUTHENTICATION ERROR";
			}
			else {
			responseBody = '{"success": "False","response": 501,"errormessage": "System had Internal Error"}';
            statusCode = 501;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "SCRIPT_EXECUTION_FAILED";
        }
		}
        else {
            responseBody = '{"success" : "False", "response" : 8099, "errormessage" : "Internal Exception. Initaite Status check after Some time"}';
            statusCode = 400;
            contentType = "json";
            encryptionFlag = false;
            flowState = "SCRIPT_EXECUTION_FAILED";
        }
    }
    else if(faultName === "ThreatDetected") {
        if (context.getVariable("regularexpressionprotection.RE-SQLAndCodeInjection.failed")) {
			responseBody = '{"success": "False","response": 403,"errormessage": "Forbidden PNOC Security Alert: SQL/Code Injection Detected"}';
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "THREAT_DETECTED";
        }
        else if (context.getVariable("regularexpressionprotection.RTP-SqlInjection.failed")) {
			responseBody = '{"success": "False","response": 403,"errormessage": "Forbidden PNOC Security Alert: SQL Attack Detected"}';
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "THREAT_DETECTED";
        }
        else {
			responseBody = '{"success": "False","response": 501,"errormessage": "System had Internal Error"}';
            statusCode = 501;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "THREAT_DETECTED";
        }
    }
    else if(faultName === "ExecutionReturnedFailure") {
        if (context.getVariable("GLOBAL_CATCH_EXCEPTION") === "DECRYPTION_FAILURE") {
            responseBody = '{"success": "False","response":8016,"errormessage":"Decryption failed"}';
            statusCode = 400;
            contentType = "json";
            encryptionFlag = false;
            flowState = "DECRYPTION_FAILURE";
        }
        else if (context.getVariable("GLOBAL_CATCH_EXCEPTION") === "ENCRYPTION_FAILURE") {
            responseBody = '{"success": "False","response":8019,"errormessage":"Response Encryption Failure"}';
            statusCode = 501;
            contentType = "json";
            encryptionFlag = false;
            flowState = "ENCRYPTION_FAILURE";
        }
        else {
			responseBody = '{"success": "False","response": 501,"errormessage": "System had Internal Error"}';
            statusCode = 501;
            contentType = "plaintext";
            encryptionFlag = false;
            flowState = "EXECUTION_RETURNED_FAILURE";
        }
    }
    else {
		responseBody = '{"success": "False","response": 501,"errormessage": "System had Internal Error"}';
        statusCode = 501;
        contentType = "plaintext";
        encryptionFlag = false;
        flowState = "INTERNAL_SERVER_ERROR";
    }
        
    try {
        if(statusCode == 200) {
            reasonPhrase = "OK";
            context.setVariable( "enableLogForFunctionalError", true );
        }
        else if(statusCode == 500)
            reasonPhrase = "System had Internal Error";
        else if(statusCode == 501)
            reasonPhrase = "System had Internal Error";
        else if(statusCode == 400)
            reasonPhrase = "Bad Request";
        else if(statusCode == 401)
            reasonPhrase = "Unauthorized";
        else if(statusCode == 429)
            reasonPhrase = "Too Many Requests";
        else if(statusCode == 403)
            reasonPhrase = "Forbidden";
            
        context.setVariable( "flow.responseBody", responseBody );
        context.setVariable( "flow.statusCode", statusCode );
        context.setVariable( "flow.contentType", contentType );
        context.setVariable( "flow.encryptionFlag", encryptionFlag );
        context.setVariable( "flow.reasonPhrase", reasonPhrase );
        
        context.setVariable("apiFlowState", flowState);
        
        if(contentType === "json") {
            context.setVariable("finalResponse", responseBody);
        } else if(contentType === "plaintext") {
            context.setVariable("finalResponse", JSON.stringify({
                "content": responseBody
            }));
        }
        
    } catch (err) {
        context.setVariable("apiFlowState", flowState);
        context.setVariable("CATCH_EXCEPTION", err);
    }
    
}
catch (err) {
    if(flowState && flowState !== "UNKNOWN")
        context.setVariable("apiFlowState", flowState);
    else
        context.setVariable("apiFlowState", "ERROR_HANDLING_FAILED");
    var responseBody, statusCode, encryptionFlag, message, responseCode;
    responseBody = 'System had Internal Error';
	responseBody = '{"success": "False","response": 501,"errormessage": "System had Internal Error"}';
    statusCode = 501;
    contentType = "plaintext";
    encryptionFlag = false;
    reasonPhrase = "System had Internal Error";
    context.setVariable("flow.responseBody", responseBody);
    context.setVariable("flow.statusCode", statusCode);
    context.setVariable("flow.contentType", contentType);
    context.setVariable("flow.encryptionFlag", encryptionFlag);
    context.setVariable( "flow.reasonPhrase", reasonPhrase );
    context.setVariable("CATCH_EXCEPTION", err);
}
