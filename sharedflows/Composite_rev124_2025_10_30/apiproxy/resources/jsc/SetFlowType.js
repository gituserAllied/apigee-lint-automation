try {
    var clientret = context.getVariable("client.received.end.time");
    var dateUTC = new Date(clientret);
    var dateUTC = dateUTC.getTime() 
    var dateIST = new Date(dateUTC);
    //date shifting for IST timezone (+5 hours and 30 minutes)
    dateIST.setHours(dateIST.getHours() + 5); 
    dateIST.setMinutes(dateIST.getMinutes() + 30);
    var hours = new Date(dateIST).getHours()
    context.setVariable("reqhour",hours);

    var pathsuffix = context.getVariable("proxy.pathsuffix");
    var basepath = context.getVariable("proxy.basepath");
    
    if(pathsuffix === "/" || pathsuffix === "" || pathsuffix === null ) {
        if(basepath === "/api/v1/composite-payment")
            context.setVariable("flowType", "COMPOSITE_PAYMENT");
        else if(basepath === "/api/v2/composite-payment")
            context.setVariable("flowType", "COMPOSITE_PAYMENT_V2");
    }
    else if(pathsuffix === "/status/imps")
        context.setVariable("flowType", "IMPS_STATUS");
    else if(pathsuffix === "/status/neft-rtgs")
        context.setVariable("flowType", "NEFT_RTGS_STATUS");
    else
        context.setVariable("flowType", "UNKNOWN");
    
    if(context.getVariable("request.header.x-priority") ==="1000"){
    context.setVariable("priorityHeader", "UPI : "+context.getVariable("request.header.x-priority"));
    }
    else if(context.getVariable("request.header.x-priority") ==="0100"){
    context.setVariable("priorityHeader", "IMPS : "+context.getVariable("request.header.x-priority"));
    }
    else if(context.getVariable("request.header.x-priority") ==="0010"){
    context.setVariable("priorityHeader", "NEFT : "+context.getVariable("request.header.x-priority"));
    }
    else if(context.getVariable("request.header.x-priority") ==="0001"){
    context.setVariable("priorityHeader", "RTGS : "+context.getVariable("request.header.x-priority"));
    }
    else{
    context.setVariable("priorityHeader", context.getVariable("request.header.x-priority"));
    }
    
    // for logging
    context.setVariable("x-priority", context.getVariable("request.header.x-priority"));
    context.setVariable("beneResponse", "");
    context.setVariable("upiResponsePayload", JSON.stringify({}));
    context.setVariable("impsResponsePayload", JSON.stringify({}));
    context.setVariable("neftResponsePayload", JSON.stringify({}));
    context.setVariable("rtgsResponsePayload", JSON.stringify({}));
    context.setVariable("misResponsePayload", JSON.stringify({}));
    context.setVariable("dbInsertRequest", JSON.stringify({}));
    
} catch(err) {
    context.setVariable("CATCH_EXCEPTION", err);
}
