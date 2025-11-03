try{
    var requestContentRaw = context.getVariable("DECODED_DECRYPTED_CONTENT")?context.getVariable("DECODED_DECRYPTED_CONTENT"):context.getVariable("request.content");
    var requestJson = JSON.parse(requestContentRaw);
    config = JSON.parse(context.getVariable("private.merchantConfig"));
    var mappedJson = "";
    var xpriority =  context.getVariable("request.header.x-priority");
    if(config.hasOwnProperty("requestMapping")){
        mappedJson = config.requestMapping;
        var impsMapping = {"mobile": "mobile", "tranRefNo": "uniqueno", "amount": "amount", "paymentRef": "remarks", "crpId": "corpid", "aggrId": "aggrid", "crpUsr": "userid", "senderName": "payeename", "retailerCode": "retailerCode", "passCode": "passcode", "bcID": "bcid", "localTxnDtTime": "datetime", "beneAccNo": "beneacctno", "beneIFSC": "beneifsc", "bnfId": "bnfId"};
        var upiMapping = {"device-id": "deviceid", "mobile": "mobile", "profile-id": "profileid", "seq-no": "uniqueno", "payee-va": "payeeva", "payer-va": "payerva", "amount": "amount", "remarks": "remarks", "mcc": "mcc", "crpID": "corpid", "aggrID": "aggrid", "userID": "userid", "vpa": "vpa", "payee-name": "payeename", "urn": "urn","payee-mcc": "payeemcc","account-provider":"accountprovider", "bnfId": "bnfId"};
        var neftMapping = {"tranRefNo": "uniqueno", "amount": "amount", "narration1": "remarks", "crpId": "corpid", "aggrId": "aggrid", "crpUsr": "userid", "beneName": "payeename", "beneAccNo": "beneacctno", "beneIFSC": "beneifsc", "aggrName": "aggrname", "txnType": "txntype", "WORKFLOW_REQD": "workflowreqd", "urn": "urn", "narration2": "narration2", "senderAcctNo": "senderacctno", "bnfId": "bnfId"};
        var rtgsMapping = {"UNIQUEID": "uniqueno", "AMOUNT": "amount", "REMARKS": "remarks", "CORPID": "corpid", "AGGRID": "aggrid", "USERID": "userid", "PAYEENAME": "payeename", "CREDITACC": "beneacctno", "IFSC": "beneifsc", "AGGRNAME": "aggrname", "TXNTYPE": "txntype", "WORKFLOW_REQD": "workflowreqd", "URN": "urn", "DEBITACC": "senderacctno", "BNFID": "bnfId" };
        var ineftMapping = {"tranRefNo": "uniqueno", "amount": "amount", "narration1": "remarks", "crpId": "corpid", "aggrId": "aggrid", "crpUsr": "userid", "beneName": "payeename", "beneAccNo": "beneacctno", "beneIFSC": "beneifsc", "aggrName": "aggrname", "txnType": "txntype", "WORKFLOW_REQD": "workflowreqd", "urn": "urn", "narration2": "narration2", "senderAcctNo": "senderacctno", "senderEmail": "senderemail", "senderName": "sendername"};
        var requestMapping = "";
        switch (xpriority) {
            case "1000":
                requestMapping = upiMapping;
                break;
            case "0100":
                requestMapping = impsMapping;
                break;
            case "0010":
                requestMapping = neftMapping;
                break;
            case "0001":
                requestMapping = rtgsMapping;
                break;
            case "ineft":
                requestMapping = ineftMapping;
                break;
        }
        if(!checkIfEmpty(requestMapping)){
            var requestContent = {};
            for (var key in mappedJson) {
                var val = mappedJson[key];
                if (requestJson.hasOwnProperty(val)) {
                    requestContent[key] = requestJson[val];
                }
            }
            var requestContentfinal = {};
            for (var key in requestMapping) {
                var val = requestMapping[key]; 
                if (requestContent.hasOwnProperty(val)) { 
                    requestContentfinal[key] = requestContent[val];
                }
            }
            context.setVariable("request.content",JSON.stringify(requestContentfinal));
            context.setVariable("DECODED_DECRYPTED_CONTENT",JSON.stringify(requestContentfinal));
        }
    }
}catch(err){
    context.setVariable("CATCH_EXCEPTION", err);
    context.setVariable("linenumber",err.lineNumber);
}
function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}