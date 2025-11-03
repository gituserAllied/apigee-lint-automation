try {
    var response = JSON.parse(context.getVariable("response.content"));
    var pathsuffix = context.getVariable("proxy.pathsuffix");
    var basepath = context.getVariable("proxy.basepath");
    
    if(pathsuffix.startsWith('/CommonPayRequest')) {
        if(response.response === "0")
            context.setVariable("TRANSACTION_TYPE", "SUCCESS");
        else
            context.setVariable("TRANSACTION_TYPE", "BACKEND_FAILURE");
    }
    
    if(!checkIfNullOrEmpty(response.response) && response.response == '0') {
        context.setVariable("functionalSuccessStatusCode", 1);
        context.setVariable("functionalErrorStatusCode", 0);
    }
    else {
        context.setVariable("functionalErrorStatusCode", 1);
        context.setVariable("functionalSuccessStatusCode", 0);
    }
        
    context.setVariable("targetResponseStatusCode", response.response + " - " + response.message);
    context.setVariable("gatewayResponseStatusCode", response.response + " - " + response.message);
    context.setVariable("MESSAGE", response.message);
} catch(err) {
    context.setVariable("CATCH_EXCEPTION", err);
    context.setVariable("TRANSACTION_TYPE", "APIGEE_FAILURE");
    context.setVariable("MESSAGE", "Internal Server Error");
    context.setVariable("targetResponseStatusCode", "APIGEE_CODE_ERR - Internal Server Error");
}


function checkIfNullOrEmpty(value) {
    return value === undefined || value === null || value === "";
}
