var APIName = context.getVariable("URI.APIName");
var NotificationFlag = true;

if(APIName == "approveProvisioning"){
    NotificationFlag = false;
}
else{
    NotificationFlag = true;
}

context.setVariable("NotificationFlag",NotificationFlag);