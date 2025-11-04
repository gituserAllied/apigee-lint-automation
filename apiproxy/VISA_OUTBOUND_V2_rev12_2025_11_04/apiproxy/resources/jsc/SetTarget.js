try{

var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
var proxyBasePath = context.getVariable("proxy.basepath");

var targetPath = "";
var targetCopy = "";

 if(proxyBasePath === "/outbound/vtis/v1"){
        if(proxyPathSuffix === "/retrieveStepUpMethods") {
            targetPath = "/mwuat/DCMS-NEW";
        }
        else if(proxyPathSuffix === "/sendPasscode"){
            targetPath = "/SendMessageOTP";
        }
        else if(proxyPathSuffix === "/checkEligibility"){
            targetPath = "/mwuat/DCMS-NEW";
        }
    }
    else if(proxyBasePath === "/outbound/vtis/v2"){
        targetPath = "/mwuat-new/BASE24";
        context.setVariable("request.header.apikey","eHVevY3G1olezySCYGSFt6Ok09b2D2Ih6UkT4JEmUSPuAZCW");
        context.setVariable("request.header.Content-Type", "application/xml");
    }

context.setVariable("targetPath", targetPath);
context.setVariable("targetCopy", targetCopy);
}
catch (err) {
    context.setVariable("CATCH_EXCEPTION", err);
    throw err;
}