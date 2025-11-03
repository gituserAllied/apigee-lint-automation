   try {
    var faultName = context.getVariable("fault.name");
    var proxy = context.getVariable("apiproxy.name");
    var pathsuffix = context.getVariable("proxy.pathsuffix");
    var defaultError = "";
    var respcode = context.getVariable("response.status.code");
    var respcontent = context.getVariable("response.content");
    var host = context.getVariable("virtualhost.aliases");
    var requestPath = context.getVariable("request.path");
    var httpProtocol = context.getVariable("request.header.X-Forwarded-Proto");
    var url = httpProtocol + "://" + host[0] + requestPath;
    
    var responseBody, statusCode, encryptionFlag, reasonPhrase;
    
     if (faultName === "FailedToResolveAPIKey" || faultName === "InvalidApiKey" || faultName === "InvalidApiKeyForGivenResource" || faultName === "IPDeniedAccess" || faultName === "invalid_access_token" || faultName === "access_token_expired") {
        responseBody = '{"success":false,"response":401,"errormessage":"Unauthorized"}';
        statusCode = 401;
        contentType = 'application/json; charset=utf-8';
        encryptionFlag = false;
    } 
    else if (faultName === "SpikeArrestViolation") {
        responseBody = 'Too Many Requests';
        statusCode = 429;
        contentType = "plaintext";
        encryptionFlag = false;
    } else if (faultName === "ExecutionFailed") {
        if (context.getVariable("jsonattack.failed") || context.getVariable("xmlattack.failed")) {
            responseBody = 'Forbidden PNOC Security Alert: Document Structure Threat Detected';
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
        }
    } else if (faultName === "ScriptExecutionFailed") {
        var cause = context.getVariable("cause");
        if (cause == "CodeInjectionParametersScript") {
            responseBody = 'Forbidden PNOC Security Alert: Code Injection Detected';
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
        }
        else if (cause === "SQLInjectionParametersScript") {
            responseBody = 'Forbidden PNOC Security Alert: SQL Attack Detected';
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
        }
        else if (context.getVariable("cause") === "EmptyJSON") {
            responseBody = '{"response":"8001","success":"false","errormessage":"JSON IS EMPTY"}';
            statusCode = 200;
            contentType = 'application/json; charset=utf-8';
            encryptionFlag = true;
        } 
        else if (context.getVariable("cause") === "ServiceNotAllowed") {
            responseBody = '{"success":false,"response":8014,"errormessage":"BACKEND_BAD_URL-The URL is incorrect."}';
            statusCode = 200;
            contentType = 'application/json; charset=utf-8';
            encryptionFlag = true;
        } 
        else if (context.getVariable("ErrorType") === "FailedToParseJSON") {
            var resp = {
                "response": "8002",
                "merchantId": context.getVariable("merchantId"),
                "subMerchantId": "",
                "terminalId": "",
                "success": "false",
                "errormessage": "INVALID_JSON.",
                "BankRRN": "",
                "merchantTranId": "",
                "Amount": ""
            };
            responseBody = JSON.stringify(resp);
            statusCode = 200;
            contentType = 'application/json; charset=utf-8';
            encryptionFlag = true;
        }
    } else if (faultName === "ThreatDetected") {
        if (context.getVariable("regularexpressionprotection.RE-SQLAndCodeInjection.failed")) {
            responseBody = 'HTTP Response Code :: 400\nDescription :: PNOC Security Alert: SQL Attack / Code Injection Detected\nFailed Threat Protection at '+context.getVariable("system.time")+' for request '+url;
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
        }
        else if (context.getVariable("regularexpressionprotection.RTP-SqlInjection.failed")) {
            responseBody = 'HTTP Response Code :: 400\nDescription :: PNOC Security Alert: SQL Attack Detected\nFailed Threat Protection at '+context.getVariable("system.time")+' for request '+url;
            statusCode = 403;
            contentType = "plaintext";
            encryptionFlag = false;
        } else {
            responseBody = 'Internal Server Error';
            statusCode = 500;
            contentType = "plaintext";
            encryptionFlag = false;
        }
    } else if (faultName === "InvalidJSONPath") {
        responseBody = '{"response":"8000","success":"false","errormessage":"Invalid Request"}';
        statusCode = 400;
        contentType = "text/json";
        // here
        encryptionFlag = false;
    } else if (faultName === "ExecutionReturnedFailure") {
        if (context.getVariable("GLOBAL_CATCH_EXCEPTION") === "DECRYPTION_FAILURE") {
            responseBody = '{"response":"8000","success":"false","errormessage":"Invalid Encrypted Request"}';
            statusCode = 400;
            contentType = "text/json";
            encryptionFlag = false;
        } else if (context.getVariable("GLOBAL_CATCH_EXCEPTION") === "ENCRYPTION_FAILURE") {
            responseBody = '{"ErrCode":"8019"}';
            statusCode = 500;
            contentType = "json";
            encryptionFlag = false;
        }
    } 
	else if (faultName === "ConnectionTimeout" || faultName ===  "GatewayTimeout" || faultName ===  "ServiceUnavailable") {
        responseBody = '{"success":false,"response":8012,"errormessage":"BACKEND_CONNECTION_TIMEOUT-Cannot connect to service"}';
        statusCode = 200;
        contentType = 'application/json; charset=utf-8';
        encryptionFlag = true;
    } 
	else if (faultName === "ErrorResponseCode") {
        if (context.getVariable("response.content") === "Requested Service Not Found !!" || context.getVariable("errormessage.status.code") === 503) {
            responseBody = '{"success":false,"errorcode":8010,"errormessage":"The system had an internal exception"}';
            statusCode = 200;
            contentType = 'application/json; charset=utf-8';
            encryptionFlag = true;
        }
    } else if (faultName === "RaiseFault") {
        responseBody = context.getVariable("error.content");
        statusCode = 400;
        contentType = 'application/json; charset=utf-8';
        encryptionFlag = true;
    }
    
    if(respcontent) {
        responseBody = respcontent;
        statusCode = respcode;
        contentType = 'application/json; charset=utf-8';
    }
    
    if(context.getVariable("CATCH_EXCEPTION_400")){
        responseBody = context.getVariable("CATCH_EXCEPTION_400");
        statusCode = 400;
        contentType = 'application/json; charset=utf-8';
        reasonPhrase = "Success";
    }
    
    if(!context.getVariable("GLOBAL_CATCH_EXCEPTION") && context.getVariable("CATCH_EXCEPTION")){
        responseBody = context.getVariable("CATCH_EXCEPTION");
        statusCode = 200;
        contentType = 'application/json';
        reasonPhrase = "Success";
    }
  
    if (!statusCode) {
        responseBody = '{"success":false,"errorcode":500,"errormessage":"The system had an internal exception"}';
        statusCode = 500;
        contentType = 'application/json; charset=utf-8';
        encryptionFlag = false;
    }
    
    try {
        if(statusCode == 200)
            reasonPhrase = "OK";
        else if(statusCode == 500)
            reasonPhrase = "Internal Server Error";
        else if(statusCode == 400)
            reasonPhrase = "Bad Request";
        else if(statusCode == 401)
            reasonPhrase = "Unauthorized";
        else if(statusCode == 403)
            reasonPhrase = "Forbidden";
        else if(statusCode == 404)
            reasonPhrase = "Not Found";
        else if(statusCode == 410)
            reasonPhrase = "Gone";
        else if(statusCode == 429)
            reasonPhrase = "Too Many Requests";
        else if(statusCode == 503)
            reasonPhrase = "Service Unavailable";
            
        context.setVariable("error.content", responseBody );
        context.setVariable("error.status.code", statusCode );
        context.setVariable("error.header.Content-Type", contentType );
        context.setVariable("error.reason.phrase", reasonPhrase );
    } catch (err) {
        context.setVariable("CATCH_EXCEPTION", err);
        
    }
    
    
 } catch (err) {
    var responseBody, statusCode, encryptionFlag, contentType;
    responseBody = defaultError;
    statusCode = 500;
    contentType = 'application/json; charset=utf-8';
    encryptionFlag = false;
    reasonPhrase = "Internal Server Error";

    context.setVariable("error.content", responseBody );
    context.setVariable("error.status.code", statusCode );
    context.setVariable("error.header.Content-Type", contentType );
    context.setVariable("error.reason.phrase", reasonPhrase );
    context.setVariable("CATCH_EXCEPTION", err);
     
}