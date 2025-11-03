//try {
    var device_id = "";
    var SeqNo = "";
    var amount_req = "";
    var payee_va = "";
    var profile_id = "";
    var seq_no = "";
    var channel_code = "";
    var purpose_code = "";
    var UpiTranlogId = "";
    var response = "";
    var UserProfile = "";
    var amount = "";
    var message = "";
    var BankRRN = "";
    var MCC = "";
   
    var myreq = JSON.parse(context.getVariable("DECODED_DECRYPTED_CONTENT"));
    var myres = JSON.parse(context.getVariable("response.content"));
    // var clientResponseLogPayload = JSON.parse(context.getVariable("clientResponseLogPayload"));
    
    // print(JSON.stringify(myres));
         /*UPI*/
    /*request*/
    // context.setVariable("device_id", "");
    // context.setVariable("amount_req", "");
    // context.setVariable("payee_va", "");
    // context.setVariable("payer_va", "");
    // context.setVariable("profile_id", "");
    // context.setVariable("seq_no", "");
    // context.setVariable("channel_code", "");
    // context.setVariable("purpose_code", "");
    // context.setVariable("mcc", "");
    /*request*/
    /*response*/
    // context.setVariable("SeqNo", "");
    // context.setVariable("UpiTranlogId", "");
    // context.setVariable("response", "");
    // context.setVariable("UserProfile", "");
    // context.setVariable("amount", "");
    // context.setVariable("message", "");
    // context.setVariable("BankRRN", "");
     /*response*/
    if(myreq['device-id'] !== null && myreq['device-id'] !== "" && myreq['device-id'] !==undefined){
        if(myreq.hasOwnProperty('device-id')){
            device_id = myreq['device-id'];
            context.setVariable("device_id", device_id);
        }
    }
    if(myreq.amount !== null && myreq.amount !== "" && myreq.amount !==undefined){
        if(myreq.hasOwnProperty('amount')){
            amount_req = myreq.amount;
            context.setVariable("amount_req", amount_req);
        }
    }
    if(myreq.hasOwnProperty('payee-va')){
        payee_va = myreq['payee-va'];
        context.setVariable("payee_va", payee_va);
    }
    
    if(myreq.hasOwnProperty('payer-va')){
        payer_va = myreq['payer-va'];
        context.setVariable("payer_va", payer_va);
    }
    if(myreq.hasOwnProperty('profile-id')){
        profile_id = myreq['profile-id'];
        context.setVariable("profile_id", profile_id);
    }
    if(myreq.hasOwnProperty('seq-no')){
        seq_no = myreq['seq-no'];
        context.setVariable("seq_no", seq_no);
    }
    if(myreq.hasOwnProperty('channel-code')){
        channel_code = myreq['channel-code'];
        context.setVariable("channel_code", channel_code);
    }
    if(myreq.hasOwnProperty('purpose-code')){
        purpose_code = myreq['purpose-code'];
        context.setVariable("purpose_code", purpose_code);
    }
    if(myreq.hasOwnProperty('mcc')){
        MCC = myreq.mcc;
        context.setVariable("MCC", MCC);
    }
    if(myreq.hasOwnProperty('UpiTranlogId')){
        UpiTranlogId = myreq.UpiTranlogId;
        context.setVariable("UpiTranlogId", UpiTranlogId);
    }
    
    
    if(myres.SeqNo !== null && myres.SeqNo !==undefined){
        if(myres.hasOwnProperty('SeqNo')){
            SeqNo = myres.SeqNo;
            context.setVariable("SeqNo", SeqNo);
        }
    }
    
    if(myres.hasOwnProperty('BankRRN')){
        BankRRN = myres.BankRRN;
        context.setVariable("BankRRN", BankRRN);
    } 
    
    if(myres.message){
        message = myres.message;
        context.setVariable("message_logging", message);
    }else{
         context.setVariable("message_logging", message);
    }
    

    if(myres.amount){
        if(myres.amount !== null && myres.amount !== undefined){
            amount = myres.amount;
            context.setVariable("amount", amount);
        }
        else{
            context.setVariable("amount", amount);
        }
    } 
    
    if(myres.UserProfile){
        if(myres.UserProfile !== null && myres.UserProfile !== undefined){
            UserProfile = myres.UserProfile;
            context.setVariable("UserProfile", UserProfile);
        }
        else{
            context.setVariable("UserProfile", UserProfile);
        }
    }
    
    if(myres.response){
        if(myres.response !== null && myres.response !== undefined){
            response = myres.response;
            context.setVariable("response_log", response);
        }
        else{
            context.setVariable("response_log", response);
        }
    }
// } catch(err) {
//     context.setVariable("CATCH_EXCEPTION", "JS-AnalyticsLoggingDev error: " + err + "");
// }


// try
// {
//     var response = JSON.parse(context.getVariable("response.content"));
//     var request = JSON.parse(context.getVariable("DECODED_DECRYPTED_CONTENT"));
    
//     //  var myreq = "";
//     // var myres = "";
//     var device_id = "";
//     var SeqNo = "";
//     var amount_req = "";
//     var payee_va = "";
//     var profile_id = "";
//     var seq_no = "";
//     var channel_code = "";
//     var purpose_code = "";
//     var UpiTranlogId = "";
//     var response = "";
//     var UserProfile = "";
//     var amount = "";
//     var message = "";
//     var BankRRN = "";

 
//     if(request.device-id){
//         device_id = request.device-id;
//         context.setVariable("device_id", device_id);
//     }
//     if(request.amount-req){
//         amount_req = request.amount-req;
//         context.setVariable("amount_req", amount_req);
//     }
//     if(request.payee-va){
//         payee_va = request.payee-va;
//         context.setVariable("payee_va", payee_va);
//     }
//     if(request.payer-va){
//         payer_va = request.payer-va;
//         context.setVariable("payer_va", payer_va);
//     }
//     if(request.profile-id){
//         profile_id = request.profile-id;
//         context.setVariable("profile_id", profile_id);
//     }
//     if(request.seq-no){
//         seq_no = request.seq-no;
//         context.setVariable("seq_no", seq_no);
//     }
//     // if(request.device-id){
//     //     device_id = request.device-id;
//     //     context.setVariable("device_id", device_id);
//     // }
//     if(request.channel-code){
//         channel_code = request.channel-code;
//         context.setVariable("channel_code", channel_code);
//     }
//     if(request.purpose-code){
//         purpose_code = request.purpose-code;
//         context.setVariable("purpose_code", purpose_code);
//     }
//     if(request.mcc){
//         mcc = request.mcc;
//         context.setVariable("mcc", mcc);
//     }


// } catch(err) {
//     context.setVariable("CATCH_EXCEPTION", "JS-AnalyticsLoggingDev error: " + err);
// }