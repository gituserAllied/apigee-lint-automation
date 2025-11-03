var config = {};
config = JSON.parse(context.getVariable("private.merchantConfig"));
context.setVariable("private.passphrase", config.passphrase);
context.setVariable("private.enableEncryption", config.enableEncryption);
context.setVariable("private.encPublicKey", config.publicKey);