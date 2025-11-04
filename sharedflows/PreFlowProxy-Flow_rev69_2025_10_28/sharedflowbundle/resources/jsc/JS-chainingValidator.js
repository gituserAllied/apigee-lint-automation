var chainingValidator = context.getVariable("chainingValidator");

var ipIdentifier = context.getVariable("verifyapikey.VA-VerifyApiKey.ipIdentifier");

if(ipIdentifier != null && ipIdentifier != undefined && ipIdentifier != ""){
    context.setVariable("verifyapikey.VA-VerifyApiKey.ipIdentifier",null);
    context.setVariable("verifyapikey.VA-VerifyApiKey.ipIdentifierinternal",ipIdentifier);
}