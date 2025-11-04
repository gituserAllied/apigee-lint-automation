try{

    var Decryptedpayload = JSON.parse(context.getVariable("Decryptedpayload"));
    var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
    var proxyBasePath = context.getVariable("proxy.basepath");
    
    if(proxyBasePath === "/outbound/vtis/v1")
        {
            if(proxyPathSuffix === "/sendPasscode" || proxyPathSuffix === "/retrieveStepUpMethods"|| proxyPathSuffix === "/checkEligibility")
                {
                    var cardholderInfo = Decryptedpayload.cardholderInfo.primaryAccountNumber;
                    
                    var SMSCARDLength = cardholderInfo.length;
                    var CARD = cardholderInfo.substring(SMSCARDLength-4,SMSCARDLength);
                    var MASKCARD = "XXXX"+CARD;
                    var SMSCARD = cardholderInfo.substring(0,6);
                    if(SMSCARD == "459648"){
                        var BIN = "UK";
                    }
                    else if(SMSCARD == "459251"){
                        var BIN = "Germany";
                    }
                    else if(SMSCARD == "459648"){
                        var BIN = "UAT";
                    }
                
                context.setVariable("BIN",BIN);
                context.setVariable("MASKCARD",MASKCARD);
                }
            else
                {
                    error = "invalid error";
                }
        }
    else if(proxyBasePath === "/outbound/vtis/v2")
        {
            var cardholderInfo = Decryptedpayload.cardholderInfo.primaryAccountNumber;
            var cvv2 = Decryptedpayload.cardholderInfo.cvv2;
            var nameCard = Decryptedpayload.cardholderInfo.name;
            var month = Decryptedpayload.cardholderInfo.expirationDate.month;
            var year = Decryptedpayload.cardholderInfo.expirationDate.year;
            var sliceYear = year.slice(2);
            var line1 = Decryptedpayload.cardholderInfo.billingAddress.line1;
            var line2 = Decryptedpayload.cardholderInfo.billingAddress.line2;
            var city = Decryptedpayload.cardholderInfo.billingAddress.city;
            var state = Decryptedpayload.cardholderInfo.billingAddress.state;
            var country = Decryptedpayload.cardholderInfo.billingAddress.country;
            var postalCode = Decryptedpayload.cardholderInfo.billingAddress.postalCode;

            var value;
            var cvv2ResultsCode = "0";

            var tokenType = context.getVariable("AP.tokenType");
            var AP_cvv2ResultsCode = context.getVariable("AP.cvv2ResultsCode");
            
            if (Decryptedpayload.cardholderInfo.hasOwnProperty("cvv2") && AP_cvv2ResultsCode == "M"){
                cvv2ResultsCode = "M";
                if(tokenType == "CARD_ON_FILE" || tokenType == "ECOMMERCE"){
    
                    if(checkIfEmpty(nameCard)){
                        nameCard = "0000000000000000000000000000000000000000000000";
                    }
                    if(checkIfEmpty(cvv2)){
                        cvv2 = "0000";
                        // value = "1";
                    }
                    else {
                        cvv2 = cvv2;
                        // value = "2";
                    }
                }
            }
            else {
                cvv2 = "";
                cvv2ResultsCode = "M";
                // cvv2 = "[" + cvv2 + "]";
                // context.setVariable("cvv2", "[" + cvv2 + "]");
                // value = "3";
            }
            // context.setVariable("value",value);
            context.setVariable("cvv2ResultsCode",cvv2ResultsCode);
            context.setVariable("cvv2",cvv2);
            context.setVariable("nameCard",nameCard);
            context.setVariable("month",month);
            context.setVariable("year",sliceYear);
            context.setVariable("line1",line1);
            context.setVariable("postalCode",postalCode);

            
        }
    else
        {
            error = "invalid error";
        }
        
    context.setVariable("cardholderInfo",cardholderInfo);
}
catch (err) {
    context.setVariable("CATCH_EXCEPTION", err);
    throw err;
}


function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}
