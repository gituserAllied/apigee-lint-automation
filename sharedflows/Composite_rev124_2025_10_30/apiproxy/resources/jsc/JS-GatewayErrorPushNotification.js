try{
    print("test in GatewayErrorPushNotification");
    var finalResponse = context.getVariable("finalResponse");
    var resposnecheck = JSON.parse(finalResponse);  
    var errorCodeArray = [997,501,8010,8011,8012,8013,8099];
    var hitPushNotification = 0;
    if(!checkIfEmpty(finalResponse)){ print("push 7");
        if(resposnecheck.hasOwnProperty("errorCode")){ print("push 8");
            var errorcode = parseInt(resposnecheck.errorCode); print("push 9" + errorcode);
            if(errorCodeArray.indexOf(errorcode) != -1){ print("push 10");
                hitPushNotification = 1; 
            }
        }
    }
    context.setVariable("hitPushNotification", hitPushNotification);
} catch (err) {
    context.setVariable("CATCH_EXCEPTION_200", err);
    context.setVariable("linenumber",err.lineNumber);
    throw err;
}
function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}