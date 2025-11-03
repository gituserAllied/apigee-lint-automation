
try{
    var backendResponse = JSON.parse(context.getVariable("response.content"));
    if(backendResponse.MobileAppData){
        if(backendResponse.MobileAppData.details.TxnStatusData[0].PayerAccount){
            var payerAcc = backendResponse.MobileAppData.details.TxnStatusData[0].PayerAccount;
            var resPayload = backendResponse;
            // trimmed Logic Started
                var trimmedtag = [];
                arrayTag = payerAcc.split("");
                for(var i = 0; i<10; i++){
                    trimmedtag.push(arrayTag[i]);
                }
                // jsonPayload.PayerAccount = trimmedtag.join("");
            // trimmed logic ended 
            resPayload.MobileAppData.details.TxnStatusData[0].PayerAccount = trimmedtag.join("");
            var body = JSON.stringify(resPayload);
            context.setVariable("response.content", body);
        }
    }
	context.setVariable("response.content", JSON.stringify(backendResponse));
}
catch(err){
    context.setVariable("CATCH_EXCEPTION", err);
    throw err;
}




            //previous logic based on message tag
// try{
    
//     var backendResponse = JSON.parse(context.getVariable("response.content"));
//     if(backendResponse.message == "Transaction Successful"){
//         var resPayload = {};
        
//         resPayload.success=backendResponse.success;
//         resPayload.response=backendResponse.response;
//         resPayload.message=backendResponse.message;
//         resPayload.BankRRN=backendResponse.BankRRN;
//         resPayload.UpiTranlogId=backendResponse.UpiTranlogId;
//         resPayload.UserProfile=backendResponse.UserProfile;
//         resPayload.SeqNo=backendResponse.SeqNo;
//         resPayload.MobileAppData = backendResponse.MobileAppData;
        
//         var payerAcc = backendResponse.MobileAppData.details.TxnStatusData[0].PayerAccount;
//         // trimmed Logic Started
//             var trimmedtag = [];
//             arrayTag = payerAcc.split("");
//             for(var i = 0; i<10; i++){
//                 trimmedtag.push(arrayTag[i]);
//             }
//             // jsonPayload.PayerAccount = trimmedtag.join("");
//         // trimmed logic ended 
//         resPayload.MobileAppData.details.TxnStatusData[0].PayerAccount = trimmedtag.join("");
        
//         resPayload.PayerRespCode = backendResponse.PayerRespCode;
//         resPayload.PayeeRespCode = backendResponse.PayeeRespCode;
//         resPayload.PayerRevRespCode = backendResponse.PayerRevRespCode;
//         resPayload.PayeeRevRespCode = backendResponse.PayeeRevRespCode;
        
//         var body = JSON.stringify(resPayload);
//         context.setVariable("response.content", body);
//     }
// 	else{
// 	    var bodyFailure = JSON.stringify(backendResponse);
//         context.setVariable("response.content", bodyFailure);
// 	}
// }
// catch(err){
//     context.setVariable("CATCH_EXCEPTION", err);
//     throw err;
// }