var beneResp = JSON.parse(context.getVariable("ServiceCallout.response"));
var req = JSON.parse(context.getVariable("request.content"));
var priorityHeader = context.getVariable("request.header.x-priority");

context.setVariable("res_Message", "");
context.setVariable("res_ErrorCode", "");
context.setVariable("res_Response", "");
if(beneResp.XML.SMSAWAY.hasOwnProperty('Message')){
    context.setVariable("res_Message", beneResp.XML.SMSAWAY.Message);
}
if(beneResp.XML.SMSAWAY.hasOwnProperty('ErrorCode')){
    context.setVariable("res_ErrorCode", beneResp.XML.SMSAWAY.ErrorCode);
}
if(beneResp.XML.SMSAWAY.hasOwnProperty('Response')){
    context.setVariable("res_Response", beneResp.XML.SMSAWAY.Response);
}
if(beneResp.XML.SMSAWAY.hasOwnProperty('ACCOUNT_ID'))
{
    if(priorityHeader === "1000") {
    req['payee-va'] = beneResp.XML.SMSAWAY.ACCOUNT_ID;
    }
    if(priorityHeader === "0100") {
      req.beneAccNo = beneResp.XML.SMSAWAY.ACCOUNT_ID;
    }
    if(priorityHeader === "0010") {
      req.beneAccNo = beneResp.XML.SMSAWAY.ACCOUNT_ID;
    }
    if(priorityHeader === "ineft") {
      req.beneAccNo = beneResp.XML.SMSAWAY.ACCOUNT_ID;
    }
    if(priorityHeader === "0001") {
      req.CREDITACC = beneResp.XML.SMSAWAY.ACCOUNT_ID;
    }    

 print("req.beneAccNo"+req.beneAccNo);
 print(req);
}
else {
    setError("ValidationError", "MissingMandatoryFieldsResponse");
}

context.setVariable("request.content",JSON.stringify(req));
context.setVariable("DECODED_DECRYPTED_CONTENT",JSON.stringify(req));

function setError(err, cause) {
    context.setVariable("cause", cause);
    throw err;
}