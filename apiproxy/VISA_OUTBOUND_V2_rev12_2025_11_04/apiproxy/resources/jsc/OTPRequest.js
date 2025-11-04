var requestPayload = context.getVariable("request.content");
var tokenRequestorID = context.getVariable("req.tokenRequestorID");
context.setVariable("tokenRequestorID",tokenRequestorID);


if(tokenRequestorID === 40010030273){
    var otpRequest = "ApplePay";
    context.setVariable("otpRequest",otpRequest);
}
else if(tokenRequestorID === 40010075001){
    var otpRequest = "GooglePay";
    context.setVariable("otpRequest",otpRequest);
}