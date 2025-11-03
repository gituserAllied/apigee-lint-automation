 try {
    var merchantHeaderKeys = context.getVariable("merchantHeaderKeys").split(",");
    var merchantHeaderValues = context.getVariable("merchantHeaderValues").split(",");
    
    for(var i = 0; i < merchantHeaderKeys.length; i++)
        context.setVariable("request.header."+merchantHeaderKeys[i], merchantHeaderValues[i]);
        
} catch (err) {
    throw "FailedToExtractConfig";
}