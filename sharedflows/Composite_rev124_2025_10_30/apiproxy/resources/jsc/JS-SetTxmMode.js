try{
    var respcontent = context.getVariable("response.content");
    var priorityHeader = context.getVariable("request.header.x-priority");
    if(priorityHeader == "0120"){
        respcontent = JSON.parse(respcontent);
        if(respcontent.hasOwnProperty("ActCode")){
            respcontent.TXNMODE = "IMPS";
        }else{
            respcontent.TXNMODE = "RGS";
        }
        context.setVariable("response.content",JSON.stringify(respcontent));
        context.setVariable("message.content",JSON.stringify(respcontent));
    }
} catch (err) {
    context.setVariable("CATCH_EXCEPTION_200", err);
    context.setVariable("linenumber",err.lineNumber);
    throw err;
}