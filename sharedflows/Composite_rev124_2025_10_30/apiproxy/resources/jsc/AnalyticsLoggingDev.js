try {
    var pathsuffix = context.getVariable("proxy.pathsuffix");
    var code = "UNKNOWN";
    var message = "UNKNOWN";
    
    if(pathsuffix === "/" || pathsuffix === "" || pathsuffix === null ) {
        var response = JSON.parse(context.getVariable("finalResponse"));
        
        // check if function success or not
        var isFunctionalSuccess = false;
        if(response.response === "0" || response.Response === "Transaction Successful" || response.ActCode === "0" || response.STATUS === "SUCCESS" || response.RESPONSE === "SUCCESS")
            isFunctionalSuccess = true;
            
        
        // check for response code
        if(response.hasOwnProperty('response'))
            code = response.response;
        else if(response.hasOwnProperty('ActCode'))
            code = response.ActCode;
        else if(response.hasOwnProperty('ERRORCODE'))
            code = response.ERRORCODE;
        
        // check for response message
        if(response.hasOwnProperty('message'))
            message = response.message;
        else if(response.hasOwnProperty('Response'))
            message = response.Response;
        else if(response.hasOwnProperty('MESSAGE'))
            message = response.MESSAGE;
        
        
        // set response status code and message
        if(isFunctionalSuccess && (code === "UNKNOWN" || message === "UNKNOWN")) {
            context.setVariable("targetResponseStatusCode", "Success");
            context.setVariable("gatewayResponseStatusCode", "Success");
        }
        else {
            context.setVariable("targetResponseStatusCode", code + " - " + message);
            context.setVariable("gatewayResponseStatusCode", code + " - " + message);
        }
        
        // is functional success or error
        context.setVariable("apiFlowState", "EXECUTION_COMPLETE");
        if(isFunctionalSuccess) {
            context.setVariable("functionalSuccessStatusCode", 1);
            context.setVariable("functionalErrorStatusCode", 0);
        }
        else {
            context.setVariable("functionalSuccessStatusCode", 0);
            context.setVariable("functionalErrorStatusCode", 1);
        }
    }
    
    else if(pathsuffix === "/status/imps") {
        var response = JSON.parse(context.getVariable("finalResponse"));
        
        if(response.ImpsResponse.ActCode === "0") {
            context.setVariable("functionalSuccessStatusCode", 1);
            context.setVariable("functionalErrorStatusCode", 0);
        }
        else {
            context.setVariable("functionalSuccessStatusCode", 0);
            context.setVariable("functionalErrorStatusCode", 1);
        }
        
        code = response.ImpsResponse.ActCode;
        message = codeMap[code];
        if(code === "UNKNOWN" || message === "UNKNOWN") {
            context.setVariable("targetResponseStatusCode", "UNKNOWN");
            context.setVariable("gatewayResponseStatusCode", "UNKNOWN");
        }
        else {
            context.setVariable("targetResponseStatusCode", code + " - " + message);
            context.setVariable("gatewayResponseStatusCode", code + " - " + message);
        }
        
        context.setVariable("apiFlowState", "EXECUTION_COMPLETE");
    }
    
    else if(pathsuffix === "/status/neft-rtgs") {
        var response = JSON.parse(context.getVariable("finalResponse"));
        
        if(response.STATUS === "SUCCESS" && response.RESPONSE === "SUCCESS") {
            context.setVariable("functionalSuccessStatusCode", 1);
            context.setVariable("functionalErrorStatusCode", 0);
        }
        else {
            context.setVariable("functionalSuccessStatusCode", 0);
            context.setVariable("functionalErrorStatusCode", 1);
        }
        
        if(response.STATUS)
            code = response.STATUS;
        if(response.MESSAGE)
            message = response.MESSAGE;
        if(code !== "UNKNOWN" && message !== "UNKNOWN") {
            context.setVariable("targetResponseStatusCode", code + " - " + message);
            context.setVariable("gatewayResponseStatusCode", code + " - " + message);
        }
        else if(code === "UNKNOWN" && message !== "UNKNOWN") {
            context.setVariable("targetResponseStatusCode", message);
            context.setVariable("gatewayResponseStatusCode", message);
        }
        else if(code !== "UNKNOWN" && message === "UNKNOWN") {
            context.setVariable("targetResponseStatusCode", code);
            context.setVariable("gatewayResponseStatusCode", code);
        }
        else {
            context.setVariable("targetResponseStatusCode", "UNKNOWN");
            context.setVariable("gatewayResponseStatusCode", "UNKNOWN");
        }
        
        context.setVariable("apiFlowState", "EXECUTION_COMPLETE");
    }
} catch(err) {
    context.setVariable("CATCH_EXCEPTION", "AnalyticsLoggingDev error: " + err);
}
