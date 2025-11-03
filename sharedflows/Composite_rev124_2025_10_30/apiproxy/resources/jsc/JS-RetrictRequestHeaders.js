try {
    var Origin = context.getVariable("request.header.Origin");
    var checkmethodoverride = context.getVariable("request.header.X-HTTPMethod-Override");
    var checkmethodoverride1 = context.getVariable("request.header.X-Method-Override");
    var checkmethodoverride2 = context.getVariable("request.header.X-HTTP-Method-Override"); 
    var wrongMethod = false;
    var JsonRes = {};
    // if (Origin) {
    //     if (Origin !== "apibankingone.icicibank.com" && Origin !== "apibankingonesandbox.icicibank.com") {
    //         throw ("400", "Bad Request", "Invalid-header-value : Origin");
    //     }
    // }
    
    if(!checkIfEmpty(checkmethodoverride) && checkmethodoverride.toLowerCase() !== "post"){
        wrongMethod = true;
        JsonRes =  {"success":"False","response":405,"errormessage":"Method not Allowed"};
    }
    if(!checkIfEmpty(checkmethodoverride1) && checkmethodoverride1.toLowerCase() !== "post"){
        wrongMethod = true;
        JsonRes =  {"success":"False","response":405,"errormessage":"Method not Allowed"};
    }
    if(!checkIfEmpty(checkmethodoverride2) && checkmethodoverride2.toLowerCase() !== "post"){
        wrongMethod = true;
        JsonRes =  {"success":"False","response":405,"errormessage":"Method not Allowed"};
    }
     context.setVariable("wrongMethod", wrongMethod);
     context.setVariable("JsonRes", JSON.stringify(JsonRes));
}
catch (err) {
    context.setVariable("CATCH_EXCEPTION", err);
    throw err;
}
function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}

function validateOrigin(allowedOriginRegex, requestOrigin) {
    var corsFlag = true;
    if (requestOrigin) {
        if (!allowedOriginRegex.test(requestOrigin)) {
            corsFlag = false;
        }
    }
    return corsFlag;
}
validateOrigin();