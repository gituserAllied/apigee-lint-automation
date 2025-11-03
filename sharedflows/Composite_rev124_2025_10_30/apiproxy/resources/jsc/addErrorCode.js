 var finalResponse=context.getVariable("finalResponse");
finalResponse=JSON.parse(finalResponse);
if(finalResponse.STATUS == "FAILURE")
{
    var errorResponse={};
    if(finalResponse.hasOwnProperty('STATUS'))
        errorResponse.STATUS=finalResponse.STATUS;
    else
        errorResponse.STATUS="";
    if(finalResponse.hasOwnProperty('MESSAGE'))
        errorResponse.MESSAGE=finalResponse.MESSAGE;
    else
        errorResponse.MESSAGE="";
    if(finalResponse.hasOwnProperty('RESPONSE'))
        errorResponse.RESPONSE=finalResponse.RESPONSE;
    else
        errorResponse.RESPONSE="";
    
    if(finalResponse.hasOwnProperty('MESSAGE'))
    {
        var message=finalResponse.MESSAGE;
        if(message.toLowerCase() == "invalid inquiry req id or unique id. please enter a valid input to proceed" || message.toLowerCase() == "invalid inquiry req id or unique id." || message.toLowerCase() == "invalid inquiry req id or unique id" || message.toLowerCase() == "invalid inquiry req id or unique id. please enter a valid input to proceed.")
        {
            errorResponse.ERRORCODE="100002"; 
            errorResponse.RESPONSECODE="100002";
        }
        else 
        {
            errorResponse.ERRORCODE="100001"; 
            errorResponse.RESPONSECODE="100001"; 
        }
    }
    else 
    {
        errorResponse.ERRORCODE="100001"; 
        errorResponse.RESPONSECODE="100001"; 
    }
    print("errorResponse "+JSON.stringify(errorResponse))
    context.setVariable("finalResponse", JSON.stringify(errorResponse));
}


