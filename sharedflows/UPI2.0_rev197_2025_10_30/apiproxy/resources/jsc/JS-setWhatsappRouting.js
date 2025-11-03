var org_name = context.getVariable("organization.name");

if(org_name == "icici-nonprod"){
    // var modifiedUrl = "/abcd/fin/web-upi-server/upi/common-pay-request";
    var modifiedUrl = "/cloud1/fin/web-upi-server/upi/common-pay-request";
}
else{
    var modifiedUrl = "/abcd/fin/web-upi-server/upi/common-pay-request";
}
context.setVariable("modifiedUrl",modifiedUrl);
context.setVariable("runnginxauth","n");