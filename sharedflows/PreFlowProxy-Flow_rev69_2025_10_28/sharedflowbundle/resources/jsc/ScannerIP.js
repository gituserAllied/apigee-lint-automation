var ipIdentifier = context.getVariable("ipIdentifier");

var isIPWhitelistEnable = false;
if(ipIdentifier !== null){
    isIPWhitelistEnable = true;
}
else{
    isIPWhitelistEnable = false;
}

context.setVariable("isIPWhitelistEnable",isIPWhitelistEnable);