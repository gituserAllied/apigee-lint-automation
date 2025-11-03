var proccode = context.getVariable('proccode');
var transactiontype = context.getVariable('transactiontype');
var transactionType = "PAY";
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

var payload = context.getVariable('clientRequestLogPayload')


context.setVariable("targetUrl", config[transactionType].targetUrl);

if (proccode == "UPI013" || proccode == "UPI042") {
	if (transactiontype == "PAY" && note == "AUTOUPDATE") {
		context.setVariable('tataAutoUpdate', true);
		context.setVariable("request.content", payload);
	}
	if (transactiontype == "COMPLAINT.TXN" && note == "AUTOUPDATE") {
		context.setVariable('tataAutoUpdate', true);
		context.setVariable("request.content", payload);
	}

} else {
	context.setVariable('tataAutoUpdate', false);
}



function checkIfNullOrEmpty(value) {
    return (value === undefined || value === null || value === "");
}