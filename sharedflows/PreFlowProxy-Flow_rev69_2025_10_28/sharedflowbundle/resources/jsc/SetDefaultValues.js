var encodedIv = context.getVariable("encodedIv");
var requestId = context.getVariable("requestId");

//Check double Hiphen in request id
var format = /^(?!.*--)/;
var speChar = format.test(requestId);
if(speChar === "true" || speChar === true){
    context.setVariable("doubleHiphen","No");
}
else
{
     context.setVariable("doubleHiphen","YES");
}

if(encodedIv === null || encodedIv === undefined){
    context.setVariable("encodedIv", "");
}

if(requestId === null || requestId === undefined){
    context.setVariable("requestId", "");
}
print(context.getVariable("private.decPrivateKey"));