var actCode = context.getVariable("actcode");
var requestUUID =  context.getVariable("requestUUID");
var MobileNo =  context.getVariable("MobileNo");
var errcode =  context.getVariable("ErrorCode");



if(errcode == "0"){
    // var res = '{"responseCode":"STEPUP","stepUpMethods":[{"type":"OTPSMS","value":"'+MobileNo+'","identifier":"'+requestUUID+'","sourceAddress":""}]}';
    var res = '{"responseCode":"STEPUP","stepUpMethods":[{"type":"OTPSMS","value":"'+MobileNo+'","identifier":"'+requestUUID+'","sourceAddress":""},{"type":"CUSTOMERSERVICE","value":"03444124444","identifier":"'+requestUUID+'","sourceAddress":""}]}';
}
else{
    if(errcode != "0"){
        var res = '{"errorCode":"'+errcode+'"}';
    }
    else{
         var res = '{"errorCode":"ISE40504"}';
    }
}

context.setVariable("response.content",res);
context.setVariable("response.header.Content-Type","application/json");