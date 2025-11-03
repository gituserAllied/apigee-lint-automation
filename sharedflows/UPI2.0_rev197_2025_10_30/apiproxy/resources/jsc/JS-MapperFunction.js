var proccode = context.getVariable('proccode');
var transactiontype = context.getVariable('transactiontype');
var note = context.getVariable('note');
context.setVariable('tataAutoUpdate', false);

var config = JSON.parse(context.getVariable("private.merchantConfig"));
print("config",config)
context.setVariable("private.authenticationType", config.authenticationType);
context.setVariable("private.encPublicKey", config.publicKey);
context.setVariable("private.validIpList", config.validIpList);
context.setVariable("verifyapikey.VA-VerifyApiKey.mode", config.mode);
context.setVariable("Action", "CallbackEncryption");

context.setVariable("private.authenticationType", config.authenticationType);
context.setVariable("private.encPublicKey", config.publicKey);
context.setVariable("private.validIpList", config.validIpList);
context.setVariable("private.apikey", config.apikey);

// Configuring the Target URL Same as Pay therefore we have hardcoded the transactionType Variable as below
var transactionType = "PAY";
context.setVariable("targetUrl", config[transactionType].targetUrl);

var payload = context.getVariable('clientRequestLogPayload')
context.setVariable('request.content',payload)