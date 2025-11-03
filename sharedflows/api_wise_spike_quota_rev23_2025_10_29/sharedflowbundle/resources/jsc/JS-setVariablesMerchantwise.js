var quotamerchantwisedaily = 300000000;
var spikemerchantwise="5000ps";
var data = context.getVariable("private.quotadata");
var valueexists = "n";
if(data != "" && data != null && data != undefined){
    var dt = data.split("#");
    if(dt.length == 1){
        quotamerchantwisedaily = dt[0];
    }
    else{
        quotamerchantwisedaily = dt[0];
        spikemerchantwise = dt[1];
       
        if(spikemerchantwise.indexOf("ps") == -1 && spikemerchantwise.indexOf("pm") == -1){
            spikemerchantwise = spikemerchantwise+"ps";
        }
    }
    valueexists = "y";
}

context.setVariable("valueexists",valueexists);

context.setVariable("quotamerchantwisedaily",quotamerchantwisedaily);
context.setVariable("spikemerchantwise",spikemerchantwise);
