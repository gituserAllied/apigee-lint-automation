try{
    var domains = context.getVariable("private.whitelisted_domains");
    print(domains);
    var myDomain = domains;
    var myDomainArray = domains.split(",");
    var isAllowedDomain = "0";
    var origin = context.getVariable("request.header.Origin");
    if(!checkIfEmpty(origin)){
        context.setVariable("isAllowedDomain",isAllowedDomain);
        if(myDomainArray.length > 1){
            if(myDomainArray.indexOf(origin) !== -1){
                isAllowedDomain = "1";
            }
        }else{
            if(origin == myDomain){
                isAllowedDomain = "1";
            }
        }
        context.setVariable("isAllowedDomain",isAllowedDomain);
    }
}catch(err){
     context.setVariable("CATCH_EXCEPTION", "JS-validateOrigin error: " + err);
}
function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}
