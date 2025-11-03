var apiproxy_name = context.getVariable("apiproxy.name");
context.setVariable("apiproxy_name",apiproxy_name);

context.setVariable("apiproxy_name_daily",apiproxy_name+"_daily");
context.setVariable("apiproxy_name_monthly",apiproxy_name+"_monthly");
context.setVariable("apiproxy_name_weekly",apiproxy_name+"_weekly");

/* default values if KVM not updated to prevent API failing */
var spike = "5000ps";
var quotamonthly = "5000000000";
var quotaweekly = "1800000000";
var quotadaily = "300000000";

/* default values if KVM not updated to prevent API failing */

var spikequotadata = {
    "spike":"5000ps",
    "quotadaily":"300000000",
    "quotaweekly":"1800000000",
    "quotamonthly":"5000000000"
};
try{
    var kvmdata = context.getVariable("private.spikequotadata");
    context.setVariable("kvmdata",kvmdata);
    if(kvmdata != null && kvmdata != undefined && kvmdata != ""){
        spikequotadata = JSON.parse(kvmdata);
    }
}
catch(e){
   print(e);
}

var spike = spikequotadata.spike;
var quotamonthly = spikequotadata.quotamonthly;
var quotaweekly = spikequotadata.quotaweekly;
var quotadaily = spikequotadata.quotadaily;

context.setVariable("spike",spike);
context.setVariable("quotamonthly",quotamonthly);
context.setVariable("quotaweekly",quotaweekly);
context.setVariable("quotadaily",quotadaily);