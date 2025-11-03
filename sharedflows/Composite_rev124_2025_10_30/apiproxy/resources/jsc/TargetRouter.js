var response = context.getVariable("response.content");
if(response !== "") {
    context.setVariable("response.content", response.replace("&", "&amp;"));        // parsse invalid character &
    
    if(context.getVariable("convertXmlToJson") === true) {
        if(context.getVariable("proxy.pathsuffix") === "/status/neft-rtgs") {
            response = JSON.parse(context.getVariable("finalResponse"));
            response = response.XML;
            context.setVariable("finalResponse", JSON.stringify(response));
        }
    }
    else
        context.setVariable("convertXmlToJson", true);
}
else {
    context.setVariable("convertXmlToJson", false);
    context.setVariable("finalResponse", "");
}
