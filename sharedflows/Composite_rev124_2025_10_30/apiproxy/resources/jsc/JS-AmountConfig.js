try{
    var allTransAmounts = context.getVariable("verifyapikey.VA-VerifyApiKey.amountConfig");
    var priorityHeader = context.getVariable("request.header.x-priority");
    var pathsuffix = context.getVariable("proxy.pathsuffix");
    var basepath = context.getVariable("proxy.basepath");
    var requestContent = context.getVariable("DECODED_DECRYPTED_CONTENT")?context.getVariable("DECODED_DECRYPTED_CONTENT"):context.getVariable("request.content");
    var request = JSON.parse(requestContent);
    var error = 0;
    var set_amt = 0;
    context.setVariable("AmountConfigErr","0");
    if(allTransAmounts != "" && allTransAmounts != null){
        if(context.getVariable("proxy.basepath") === "/api/v1/composite-payment" || context.getVariable("proxy.basepath") === "/api/v2/composite-payment") {
            var myamtJson = JSON.parse(allTransAmounts);
            if(myamtJson.hasOwnProperty("UPI") && priorityHeader == '1000'){
                requestedamt = request.amount;
                print('UPI AMT:'+myamtJson.UPI +' - '+ requestedamt);
                set_amt = myamtJson.UPI;
            }else if(myamtJson.hasOwnProperty("IMPS") && priorityHeader == '0100'){
                requestedamt = request.amount;
                print('IMSP AMT:'+myamtJson.IMPS +' - '+ requestedamt);
                set_amt = myamtJson.IMPS;
            }else if(myamtJson.hasOwnProperty("NEFT") && priorityHeader == '0010'){
                requestedamt = request.amount;
                print('NEFT AMT:'+myamtJson.NEFT +' - '+ requestedamt);
                set_amt = myamtJson.NEFT;
            }else if(myamtJson.hasOwnProperty("RTGS") && priorityHeader == '0001'){
                requestedamt = request.AMOUNT;
                print('RTGS AMT:'+myamtJson.RTGS +' - '+ requestedamt);
                set_amt = myamtJson.RTGS;
            }else if(myamtJson.hasOwnProperty("ineft") && priorityHeader == 'ineft'){
                requestedamt = request.amount;
                print('ineft AMT:'+myamtJson.ineft +' - '+ requestedamt);
                set_amt = myamtJson.ineft;
            }
            requestedamt = parseFloat(requestedamt);
            set_amt = parseFloat(set_amt);
            print("check condition: " + requestedamt + ' >  '+ set_amt);
            if(requestedamt > set_amt && set_amt > 0){
                error = 1;
            }
        }
    }
    if(error == 1){
        context.setVariable("AmountConfigErr",error);
        print("my amount error");
    }else{
        print('No Amt found');
    }
} catch(err) {
    context.setVariable("CATCH_EXCEPTION", "JS-AmountConfig error: " + err);
}