var allowed_count = context.getVariable("ratelimit.Q-MerchantWiseDaily.allowed.count")
var user_count = context.getVariable("ratelimit.Q-MerchantWiseDaily.used.count");
var merchant_application_id = context.getVariable("verifyapikey.VA-VerifyApiKey.developer.app.id");
var perc_used = Math.ceil((user_count/allowed_count) * 100)


if (perc_used >= 75){
    context.setVariable("QuotaAlert", true);
}
else{
    context.setVariable("QuotaAlert", false);
}



context.setVariable("QuotaUsedPercentage",perc_used);
context.setVariable("Developer_App_ID",merchant_application_id);