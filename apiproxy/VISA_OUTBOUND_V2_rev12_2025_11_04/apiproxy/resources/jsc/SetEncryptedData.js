var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
var proxyBasePath = context.getVariable("proxy.basepath");

 if(proxyBasePath === "/outbound/vtis/v1")
        {
            if(proxyPathSuffix === "/sendPasscode")
                {
                    var encryptedData = context.getVariable("req.encryptedData");
                }
            else if(proxyPathSuffix === "/retrieveStepUpMethods")
                {
                    var encryptedData = context.getVariable("GCV.encryptedData");
                }
            else if(proxyPathSuffix === "/checkEligibility")
                {
                  var encryptedData = context.getVariable("CE.encryptedData");
                }
            else
                {
                    error = "invalid error";
                }
        }
    else if(proxyBasePath === "/outbound/vtis/v2")
        {
            var encryptedData = context.getVariable("AP.encryptedData");
        }
    else
        {
            error = "invalid error";
        }
        
    context.setVariable("encryptedData",encryptedData);