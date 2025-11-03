try {
    var backendUrl = context.getVariable("private.backendUrl");
    // var apitype = context.getVariable("private.apitype");
    var pathsuffix = context.getVariable("proxy.pathsuffix");
    var pathPrefix = "/upi-switch/api/psp/v2direct/";

    print("backendUrl"+backendUrl);
    print("pathsuffix"+pathsuffix);
    context.setVariable("modifiedUrl", pathPrefix + backendUrl);
    
    
    context.setVariable("target.copy.pathsuffix", false);
} catch (error) {
    context.setVariable("CATCH_EXCEPTION", error);
    throw error;
}