var merchant = context.getVariable("developer.app.name");
if(merchant === "Composite_Test") {
    context.setVariable("flow.encryptionFlag", false);
    context.setVariable("private.isInternal", "true");
}

var config = {};
config = JSON.parse(context.getVariable("private.merchantConfig"));
context.setVariable("enableEncryption", config.enableEncryption);
context.setVariable("isNodal", config.isNodal);
var request = {};
if(context.getVariable("enableEncryption") === false || context.getVariable("enableEncryption") === "false") {
    request = JSON.parse(context.getVariable("request.content"));
}
else if(context.getVariable("enableEncryption") === true || context.getVariable("enableEncryption") === "true"){ 
    request = JSON.parse(context.getVariable("DECODED_DECRYPTED_CONTENT"));
}
var priorityHeader = context.getVariable("request.header.x-priority");
var pathsuffix = context.getVariable("proxy.pathsuffix");
var basepath = context.getVariable("proxy.basepath");

var settlement_id = context.getVariable("request.header.settlement_id");
var header_xpriority = false;
var header_settlement_id = false;
var dmzeebackend = false;
context.setVariable("header_xpriority",header_xpriority);
if(!checkIfEmpty(settlement_id)){
    var xprioritymapping = {"1000":"10000","0100":"01000","0010":"00001","0001":"00010","ineft":"00100"};
    header_xpriority = xprioritymapping[priorityHeader];
    context.setVariable("header_xpriority",header_xpriority);
    context.setVariable("header_settlement_id",settlement_id);
    dmzeebackend = true;
}
context.setVariable("dmzeebackend",dmzeebackend);

var mandatoryUPIParameters = ["mobile", "device-id", "seq-no", "payer-va", "profile-id", "amount", "remarks", "account-provider"];
var mandatoryIMPSParameters = ["amount", "tranRefNo", "paymentRef", "senderName", "mobile", "retailerCode", "passCode", "bcID"];
var mandatoryNEFTParameters = ["tranRefNo", "amount", "senderAcctNo", "beneName", "beneIFSC", "narration1", "crpId", "crpUsr", "aggrId", "urn", "aggrName", "txnType"];
var mandatoryRTGSParameters = ["AGGRID", "CORPID", "USERID", "URN", "AGGRNAME", "UNIQUEID", "DEBITACC", "IFSC", "AMOUNT", "TXNTYPE", "PAYEENAME", "REMARKS"];
var mandatoryBulkParameters = ["CORP_ID","USER_ID","AGGR_NAME","AGGR_ID","URN","UNIQUE_ID","FILE_DESCRIPTION","AGOTP","FILE_NAME","FILE_CONTENT"];
var mandatoryineftParameters = ["beneAccNo"];
var mandatoryWFIMPSParameters = ["CORPID","USERID","URN","AGGRID","AGGRNAME","UNIQUEID","DEBITACC","CREDITACC","IFSC","AMOUNT","TXNTYPE","PAYEENAME","REMARKS","CURRENCY","WORKFLOW_REQD"];

if(priorityHeader == "0010"){
    if(checkIfEmpty(request.bnfId)){ 
        mandatoryNEFTParameters.push("beneAccNo"); 
    }else if(checkIfEmpty(request.beneAccNo)){ 
        mandatoryNEFTParameters.push("bnfId"); 
    }
}
if(priorityHeader == "0001"){
    if(checkIfEmpty(request.BNFID)){ 
        mandatoryRTGSParameters.push("CREDITACC"); 
    }else if(checkIfEmpty(request.CREDITACC)){ 
        mandatoryRTGSParameters.push("BNFID"); 
    }
}

print(mandatoryNEFTParameters);
var priorityArr = ["UPI", "IMPS", "NEFT", "RTGS","BULK","ineft","WFIMPS"];
var priorityObject = JSON.parse(context.getVariable("priorityObject"));

var maxAmount = context.getVariable("verifyapikey.VA-VerifyApiKey.maximumAmount");
print("maxAmount" + maxAmount); 	

var isValidRequest = true;
var validateFieldsForTransactionType = "";
var calloutRequest = "";        // set at the end for passing into the request callout
var inputRequest = {};          // to be used for url encoding the callout reqquest
var calloutURL = "";

if(pathsuffix !== "/status/imps" && pathsuffix !== "/status/neft-rtgs") {
    // process request 
    if(!context.getVariable("isTransactionSuccessful")) {            // execute last JS in the flow
        if(!priorityObject) {                                           // if this is the first time visiting this JS
           
            // for logging
            context.setVariable("x-priority", priorityHeader);
            context.setVariable("beneResponse", "");
            context.setVariable("upiResponsePayload", JSON.stringify({}));
            context.setVariable("impsResponsePayload", JSON.stringify({}));
            context.setVariable("neftResponsePayload", JSON.stringify({}));
            context.setVariable("rtgsResponsePayload", JSON.stringify({}));
            context.setVariable("misResponsePayload", JSON.stringify({}));
            context.setVariable("dbInsertRequest", JSON.stringify({}));
            
            
            var priorityObject = {
                "priorityStage" : "checkNodal"
            };
            setTransactionPriority();
            validateRequest();
                if(context.getVariable("private.isNodal") === "true"){
                    setNodalRequest(); 
                }else {
                    priorityObject.priorityStage = "priority1";         // if the merchant is non nodal, we are not doing beneficiary validation. Hence sckip the stage beneciaryValidation and set to priority1
                    context.setVariable("makeTransaction", true);
                    setCalloutRequest(); print("callout 65");
                }
        }
        else {
            var priority = priorityObject[priorityObject.priorityStage];
            // increment priorityStage
            if(priorityObject.priorityStage === "checkNodal")
                priorityObject.priorityStage = "priority1";     
            else if(priorityObject.priorityStage === "priority1")
                priorityObject.priorityStage = "priority2";
            else if(priorityObject.priorityStage === "priority2")
                priorityObject.priorityStage = "priority3";
            else if(priorityObject.priorityStage === "priority3")
                priorityObject.priorityStage = "priority4";
            else if(priorityObject.priorityStage === "priority4")
                priorityObject.priorityStage = "allDown";
            
            // decide on next steps
            if(priorityObject.priorityStage === "checkNodal2") {           // when first priority was UPI but it failed and we retried beneficiary validation. check it's response
                // for logging
                var beneResponse = context.getVariable("beneficiaryCheckResponse.content");
                try {
                    JSON.parse(beneResponse);
                } catch(err) {
                    beneResponse = escapeXml(beneResponse);
                    beneResponse = JSON.stringify({
                        "content": "\"" + beneResponse + "\""
                    });
                }
                context.setVariable("beneResponse", beneResponse);
                
                if(context.getVariable("beneficiaryCheckResponse.status.code") === 200) {
                    var beneResp = JSON.parse(context.getVariable("beneficiaryCheckResponse.content"));
                    if(beneResp && beneResp.hasOwnProperty('XML') && beneResp.XML.hasOwnProperty('SMSAWAY') && beneResp.XML.SMSAWAY.hasOwnProperty('Response')) {
                        if(beneResp.XML.SMSAWAY.Response === "SUCCESS") {
                            context.setVariable("isValidBeneficiary", true);
                            priorityObject.priorityStage = "priority2";
                            setCalloutRequest(); print("callout 102");
                        }
                        else {
                            context.setVariable("isValidBeneficiary", false);
                            //Changed for new req i.e, to remove SMSAWAY original -beneResp
                            if(priorityHeader!= "1000")
                                {
                                    var beneErrorResp={};
                                    if(beneResp.XML.SMSAWAY.hasOwnProperty('ErrorCode'))
                                        beneErrorResp.errorCode=beneResp.XML.SMSAWAY.ErrorCode;
                                    else
                                        beneErrorResp.errorCode="";

                                    if(beneResp.XML.SMSAWAY.hasOwnProperty('Message'))
                                        beneErrorResp.description=beneResp.XML.SMSAWAY.Message;
                                    else
                                        beneErrorResp.description="";

                                    context.setVariable("finalResponse", JSON.stringify(beneErrorResp));
                                }
                            else
                                context.setVariable("finalResponse", JSON.stringify(beneResp));
                            context.setVariable("dbOperation", "SKIPPED");
                            context.setVariable("retry", false);
                        }
                    }
                    else {
                        context.setVariable("dbOperation", "SKIPPED");
                        context.setVariable("isValidBeneficiary", false);
                        context.setVariable("finalResponse", context.getVariable("beneficiaryCheckResponse.content"));
                    }
                }
            }
            else if(priorityObject.priorityStage === "priority1") {
                // for logging
                var beneResponse = context.getVariable("beneficiaryCheckResponse.content");
                try {
                    JSON.parse(beneResponse);
                } catch(err) {
                    beneResponse = escapeXml(beneResponse);
                    beneResponse = JSON.stringify({
                        "content": "\"" + beneResponse + "\""
                    });
                }
                context.setVariable("beneResponse", beneResponse);
                
                if(context.getVariable("beneficiaryCheckResponse.status.code") === 200) {
                    var beneResp = JSON.parse(context.getVariable("beneficiaryCheckResponse.content"));
                    if(beneResp && beneResp.hasOwnProperty('XML') && beneResp.XML.hasOwnProperty('SMSAWAY') && beneResp.XML.SMSAWAY.hasOwnProperty('Response')) {
                        if(beneResp.XML.SMSAWAY.Response === "SUCCESS") {
                            context.setVariable("isValidBeneficiary", true);
                            setCalloutRequest();print("callout 153");
                        }
                        else {
                            context.setVariable("isValidBeneficiary", false);
                            var calloutResponse = JSON.parse(context.getVariable("beneficiaryCheckResponse.content"));
                            //Changed for new req i.e, to remove SMSAWAY original -calloutResponse.XML
                            if(priorityHeader!= "1000")
                                {
                                    var beneErrorResp={};
                                    if(beneResp.XML.SMSAWAY.hasOwnProperty('ErrorCode'))
                                        beneErrorResp.errorCode=beneResp.XML.SMSAWAY.ErrorCode;
                                    else
                                        beneErrorResp.errorCode="";

                                    if(beneResp.XML.SMSAWAY.hasOwnProperty('Message'))
                                        beneErrorResp.description=beneResp.XML.SMSAWAY.Message;
                                    else
                                        beneErrorResp.description="";
                                    print("beneErrorResp "+JSON.stringify(beneErrorResp));

                                    context.setVariable("finalResponse", JSON.stringify(beneErrorResp));
                                }
                            else
                            {
                                var response = Object.assign({}, calloutResponse.XML);
                                context.setVariable("finalResponse", JSON.stringify(response));
                            }
                            
                            context.setVariable("dbOperation", "SKIPPED");
                        }
                    }
                    else {
                        context.setVariable("dbOperation", "SKIPPED");
                        context.setVariable("isValidBeneficiary", false);
                        context.setVariable("finalResponse", context.getVariable("beneficiaryCheckResponse.content"));
                    }
                }
                else 
                    setError("InvalidResponseStatusCode", "BeneficiaryValidationFailed");
            }
            else if(priorityObject.priorityStage === "priority2" || priorityObject.priorityStage === "priority3" || priorityObject.priorityStage === "priority4" || priorityObject.priorityStage === "allDown") {
                var calloutStatusCode = context.getVariable("calloutResponse.status.code");
                
                // for logging response payloads
                if(calloutStatusCode !== 200) {
                    var failedResp = context.getVariable("calloutResponse.content");
                    try {
                        JSON.parse(failedResp);
                    } catch(err) {
                        failedResp = escapeXml(failedResp);
                        failedResp = JSON.stringify({
                            "content": failedResp
                        });
                    }

                    var lat = Math.floor(context.getVariable("apigee.metrics.policy.SC-TransactionPriority.timeTaken")/1000000);
                    if(priority === "UPI") {
                        context.setVariable("upiResponsePayload", failedResp);
                        context.setVariable("upiExecutionLatency", lat);
                        context.setVariable("upiResponseStatusCode", context.getVariable("calloutResponse.status.code"));
                    }
                    else if(priority === "NEFT") {
                        context.setVariable("neftResponsePayload", failedResp);
                        context.setVariable("neftExecutionLatency", lat);
                        context.setVariable("neftResponseStatusCode", context.getVariable("calloutResponse.status.code"));
                    }
                    else if(priority === "RTGS") {
                        context.setVariable("rtgsResponsePayload", failedResp);
                        context.setVariable("rtgsExecutionLatency", lat);
                        context.setVariable("rtgsResponseStatusCode", context.getVariable("calloutResponse.status.code"));
                    }
                    else if(priority === "IMPS") {
                        context.setVariable("impsResponsePayload", failedResp);
                        context.setVariable("impsExecutionLatency", lat);
                        context.setVariable("impsResponseStatusCode", context.getVariable("calloutResponse.status.code"));
                    }
                }
                
                if(calloutStatusCode === 200) {
                    context.setVariable("isTransactionSuccessful", true);
                    var calloutResponse = JSON.parse(context.getVariable("calloutResponse.content"));
                    var response = {};
                    if(context.getVariable("calloutURL") === "api/v1/local/composite/upi"){
                        response = Object.assign({}, calloutResponse);                  // assign response as is in case of UPI
                    }else if(context.getVariable("calloutURL") === "api/v1/local/composite/bulk"){
                       if(calloutResponse.XML.hasOwnProperty("SMSAWAY")){
                            response = Object.assign({}, calloutResponse.XML.SMSAWAY);
                        }else{
                            response = Object.assign({}, calloutResponse.XML);
                        }
                    }else if(context.getVariable("calloutURL") === "api/v1/local/composite/wfimps"){
                        if(calloutResponse.XML.hasOwnProperty("SMSAWAY")){
                            response = Object.assign({}, calloutResponse.XML.SMSAWAY);
                        }else{
                            response = Object.assign({}, calloutResponse.XML);
                        }
                    }else {
                        if(calloutResponse.XML)
                            response = Object.assign({}, calloutResponse.XML);          // extract XML from response and then assign
                        else if(calloutResponse.ImpsResponse)
                            response = Object.assign({}, calloutResponse.ImpsResponse);
                        else
                            response = Object.assign({}, calloutResponse);              // if XML tag not found, assign as is
                    }

                    var lat = Math.floor(context.getVariable("apigee.metrics.policy.SC-TransactionPriority.timeTaken")/1000000);
                    if(priority === "UPI") {
                      context.setVariable("upiResponsePayload", JSON.stringify(response));
                      context.setVariable("upiExecutionLatency", lat);
                      context.setVariable("upiResponseStatusCode", context.getVariable("calloutResponse.status.code"));
                    }
                    if(priority === "NEFT") {
                      context.setVariable("neftResponsePayload", JSON.stringify(response));
                      context.setVariable("neftExecutionLatency", lat);
                      context.setVariable("neftResponseStatusCode", context.getVariable("calloutResponse.status.code"));
                    }
                    else if(priority === "RTGS") {
                      context.setVariable("rtgsResponsePayload", JSON.stringify(response));
                      context.setVariable("rtgsExecutionLatency", lat);
                      context.setVariable("rtgsResponseStatusCode", context.getVariable("calloutResponse.status.code"));
                    }
                    else if(priority === "IMPS") {
                      response.success = true;
                      response.TransRefNo = response.TranRefNo;
                      delete response.TranRefNo;
                      context.setVariable("impsResponsePayload", JSON.stringify(response));
                      context.setVariable("impsExecutionLatency", lat);
                      context.setVariable("impsResponseStatusCode", context.getVariable("calloutResponse.status.code"));
                    }
                   	var date = getDate();
                    context.setVariable("date", date);
                    var remName = context.getVariable("apigee.developer.app.name");
                    var uuid = context.getVariable("messageid");
                    calloutURL = context.getVariable("calloutURL");
                    if(calloutURL === "api/v1/local/composite/upi"){
                        var upiActionablejson = context.getVariable("upiActionablejson"); //taken from JS-MIS-JSON-PCK
                        var upiactionablestr = "";
                        if(response.hasOwnProperty('response')){
                             var key = response.response;
                             if(upiActionablejson.hasOwnProperty(key)){
                              upiactionablestr = upiActionablejson[key];
                             }   
                         }
                         
                        /*masked payeeva*/ 
                        var payee_vpa = request['payee-va'];
                        var lengthpayee = payee_vpa.indexOf('@');
                        var startlen = 0;
                        var ccpay = payee_vpa.substring(0, 6);
                        var cc = payee_vpa.substring(0, 3);
                        var condition = false;
                        ccpay = ccpay.toLowerCase();
                        cc = cc.toLowerCase();
                        if(ccpay == 'ccpay.'){
                            condition = true;
                            startlen = 6;
                        }else if(cc == "cc."){
                            condition = true;
                            startlen = 3;
                        }
                        if(condition === true){
                            var masked_payee_vpa = MaskData(payee_vpa, startlen,lengthpayee);
                            payee_vpa = masked_payee_vpa;
                        }
                        /*masked payeeva*/ 
                        setDbInsertRequest("", response.response, "UPI", date, request['seq-no'], remName, response.message, request.mobile, payee_vpa, request.amount, response.BankRRN, "", remName, upiactionablestr, request['payee-name'], request['payer-va'], request.remarks, uuid);
                    }else if(calloutURL === "api/v1/local/composite/imps"){
                        var impsActionablejson = context.getVariable("impsActionablejson"); //taken from JS-MIS-JSON-PCK
                    	var impsactionablestr = "";
                    	 if(response.hasOwnProperty('ActCode')){
                    		 var key = response.ActCode;
                    		 if(impsActionablejson.hasOwnProperty(key)){
                    			impsactionablestr = impsActionablejson[key];
                    		 }   
                    	 }
                        setDbInsertRequest(request.beneIFSC, response.ActCode, "IMPS", date, request.tranRefNo, request.senderName, response.Response, request.mobile, request.beneAccNo, request.amount, response.BankRRN, request.bcID, remName, impsactionablestr, response.BeneName, "", request.paymentRef, uuid);
                    }else if(calloutURL === "api/v1/local/composite/neft") {
                        var retailercode = "NEFT";
                        if(request.hasOwnProperty('txnType')){
                            var txnType = request.txnType;
                            if(txnType == "TPA"){
                                retailercode = "Fund Transfer";
                            }
                        }
                        var utrno = null;
                        if(response.hasOwnProperty('UTRNUMBER')){
                            utrno = response.UTRNUMBER;
                        }
                        var neftRespCode = "";
                        var neftStatus = "SUCCESS";
                        if(response.STATUS !== "SUCCESS" || response.RESPONSE !== "SUCCESS") {
                            neftRespCode = response.ERRORCODE;
                            neftStatus = response.MESSAGE;
                        }
                        var neftrtgsActionablejson = context.getVariable("neftrtgsActionablejson");
                        var neftrtgsactionablestr = "";
                        if(response.hasOwnProperty('ERRORCODE')){
                            var key = response.ERRORCODE;
                            if(neftrtgsActionablejson.hasOwnProperty(key)){
                                neftrtgsactionablestr = neftrtgsActionablejson[key];
                            }
                        }else{
                            neftrtgsactionablestr = getActionableForRtgsNeft(request,response);
                        }
                        setDbInsertRequest(request.beneIFSC, neftRespCode, retailercode, date, request.tranRefNo, remName, neftStatus, "", request.beneAccNo, request.amount, utrno, request.senderAcctNo, remName,neftrtgsactionablestr, request.beneName, "", request.narration1, uuid);
                    }else if(calloutURL === "api/v1/local/composite/rtgs") {
                        var retailercode = "RTGS";
                        if(request.hasOwnProperty('TXNTYPE')){
                            var txnType = request.TXNTYPE;
                            if(txnType == "TPA"){
                                retailercode = "Fund Transfer";
                            }
                        }
                        var utrno = null;
                        if(response.hasOwnProperty('UTRNUMBER')){
                            utrno = response.UTRNUMBER;
                        }
                        var rtgsRespCode = "";
                        var rtgsStatus = "SUCCESS";
                        if(response.STATUS !== "SUCCESS" || response.RESPONSE !== "SUCCESS") {
                            rtgsRespCode = response.ERRORCODE;
                            rtgsStatus = response.MESSAGE;
                        }
                        var neftrtgsActionablejson = context.getVariable("neftrtgsActionablejson");
                         var neftrtgsactionablestr = "";
                         if(response.hasOwnProperty('ERRORCODE')){
                             var key = response.ERRORCODE;
                             if(neftrtgsActionablejson.hasOwnProperty(key)){
                                neftrtgsactionablestr = neftrtgsActionablejson[key];
                             }
                         }else{
                            neftrtgsactionablestr = getActionableForRtgsNeft(request,response);
                         }
                        setDbInsertRequest(request.IFSC, rtgsRespCode, retailercode, date, request.UNIQUEID, remName, rtgsStatus, "", request.CREDITACC, request.AMOUNT, utrno, request.DEBITACC, remName, neftrtgsactionablestr, request.PAYEENAME, "", request.REMARKS, uuid);
                    }else if(calloutURL === "api/v1/local/composite/bulk"){
                        var bulkstatus = "";
                        if(response.hasOwnProperty("ErrorCode")){
                        	bulkstatus = response.Message;
                        }else{
                        	bulkstatus = response.MESSAGE_DESC;
                        }
                        setDbInsertRequest("", "", "BULK", "", request.UNIQUE_ID, "", bulkstatus, "", "", "", request.FILE_SEQUENCE_NUM, "", "", "", "", "", request.FILE_NAME, "");
                    }else if(calloutURL === "api/v1/local/composite/ineft"){
                        var ineftStatus = "";
                        if(response.hasOwnProperty("ERRORCODE")){
                        	ineftStatus = response.MESSAGE;
                        }else{
                        	ineftStatus = response.STATUS;
                        }
                        setDbInsertRequest(request.beneIFSC, response.ERRORCODE, "INEFT", "", request.tranRefNo, request.beneName, ineftStatus, request.senderEmail, request.beneAccNo, request.amount, request.urn, "", "", "", "", "", "","");
						}
                    else if(calloutURL === "api/v1/local/composite/wfimps"){
                        var bulkstatus = "";
                        // if(response.hasOwnProperty("ErrorCode")){
                        // 	bulkstatus = response.Message;
                        // }else{
                        // 	bulkstatus = response.MESSAGE_DESC;
                        // }
                        //setDbInsertRequest("", "", "WFIMPS", "", request.UNIQUEID, "", bulkstatus, "", "", "", request.FILE_SEQUENCE_NUM, "", "", "", "", "", request.FILE_NAME, "");
                    }
                    if(priority === "IMPS" && priorityHeader === "0120") {
                        print("Line 313 Error Code Wise Block");
                        if(priorityHeader ==="0120" && response.ActCode==="6" || response.ActCode==="10" || response.ActCode==="12" || response.ActCode==="15" || response.ActCode==="18" || response.ActCode==="19" || response.ActCode==="20" || response.ActCode==="21" || response.ActCode==="24" || response.ActCode==="32" || response.ActCode==="35" || response.ActCode==="36" || response.ActCode==="39" || response.ActCode==="41" || response.ActCode==="51" || response.ActCode==="60" || response.ActCode==="61" || response.ActCode==="62" || response.ActCode==="70" || response.ActCode==="71" || response.ActCode==="72" || response.ActCode==="73" || response.ActCode==="74" || response.ActCode==="75" || response.ActCode==="77" || response.ActCode==="96" || response.ActCode==="101" || response.ActCode==="403" || response.ActCode==="901" || response.ActCode==="902" || response.ActCode==="903" || response.ActCode==="904" || response.ActCode==="905" || response.ActCode==="U01" || response.ActCode==="U02" || response.ActCode==="U03" || response.ActCode==="U04" || response.ActCode==="U06" || response.ActCode==="U07" || response.ActCode==="U17" || response.ActCode==="U28" || response.ActCode==="U48" || response.ActCode==="U49"|| response.ActCode==="U52"){
                            resolveRetry();
                            print("Inside Error Block" + response.ActCode);
                            setCalloutRequest();print("callout 381");
                            context.setVariable("isTransactionSuccessful", false);
                            context.setVariable("retry", true);
                        } else{
                                context.setVariable("finalResponse", JSON.stringify(response));
                                context.setVariable("retry", false);
                            }
                    }else{
                    context.setVariable("finalResponse", JSON.stringify(response));
                    context.setVariable("retry", false);
                    }
                   
                }
                else {
                    setError("RetryLimitReached", "AllBackendsDown");
                    context.setVariable("retry", false);
                }
                
            }
        }
    }
    else {
        /*
         *  Logic for db insert request creation
        */
        var dbResponse = context.getVariable("dbResponse.content");
        context.setVariable("misResponseStatusCode", context.getVariable("dbResponse.status.code"));
        if(dbResponse) {
            try {
                dbResponse = JSON.parse(dbResponse);
                if(context.getVariable("dbResponse.status.code") == 200) {
                    if(dbResponse.Status === "DATA INSERTED")
                        context.setVariable("dbOperation", "SUCCESSFUL");
                    else
                        context.setVariable("dbOperation", "FAILED");
                }
                else {
                    context.setVariable("dbOperation", "FAILED");
                    if(dbResponse.errorCode === "APIGEE_FAILURE")
                        context.setVariable("debugError", dbResponse.response);
                    else
                        context.setVariable("debugError", "DB Insert error - Check dbResponsePayloadInLog");
                }
                context.setVariable("misResponsePayload", JSON.stringify(dbResponse));
            } catch(err) {
                if(dbResponse === "success") {
                    context.setVariable("dbOperation", "SUCCESSFUL");
                    context.setVariable("misResponsePayload", JSON.stringify({
                    	"content": escapeXml(dbResponse)
                    }));
                }
                else {
                    context.setVariable("dbOperation", "FAILED");
                    context.setVariable("debugError", "DB Insert error - non json response from MIS API");
                    context.setVariable("misResponsePayload", JSON.stringify({
                    	"content": escapeXml(dbResponse)
                    }));
                }
            }
        }
    }
    
    // set variables only if the transaction is not successful
    if(context.getVariable("isTransactionSuccessful") !== true) {
        context.setVariable("priorityObject", JSON.stringify(priorityObject));
        context.setVariable("calloutRequest", calloutRequest);
        context.setVariable("calloutURL", calloutURL);
    }
}
else if (pathsuffix === "/status/imps") {
    if(!(checkIfEmpty(request.transRefNo) || checkIfEmpty(request.passCode) || checkIfEmpty(request.bcID))) {
        inputRequest.TranRefNo = request.transRefNo;
        inputRequest.PassCode = request.passCode;
        urlEncodeRequest();
        calloutURL = "/imps-web-bc/api/transaction/bc/" +request.bcID+ "/query?";
        //calloutURL = "/api/v0/apigee_Imps_status?bcID=" + request.bcID;
        context.setVariable("calloutRequest", calloutRequest.replace(/\"/g,""));
        context.setVariable("modifiedUrl", calloutURL);
    }
    else
        setError("ValidationError", "MissingMandatoryFields");
}
else if (pathsuffix === "/status/neft-rtgs") {
    if(!(checkIfEmpty(request.UNIQUEID) || checkIfEmpty(request.CORPID) || checkIfEmpty(request.USERID) || checkIfEmpty(request.AGGRID) || checkIfEmpty(request.URN))) {
        inputRequest = Object.assign({}, request);
        inputRequest.REQUESTFROM = "AGTR";
        inputRequest.REQUESTTYPE = "AGTXNINQ";
        inputRequest.BANKID = "ICI";
        inputRequest.REQID = "";
        urlEncodeRequest();
        calloutURL = "/BANKAWAYMOBILE?REQUESTFROM=AGTR&REQUESTTYPE=AGTXNINQ&BANKID=ICI&CORPID=" + request.CORPID + "&USERID="+ request.USERID+ "&AGGRID=" + request.AGGRID + "&REQID=" +inputRequest.REQID+ "&UNIQUEID=" +request.UNIQUEID+ "&URN=" +request.URN;
       // calloutURL = "/api/v0/apigee_composite_status";
        context.setVariable("calloutRequest", calloutRequest.replace(/\"/g,""));
        context.setVariable("modifiedUrl", calloutURL);
    }
    else
        setError("ValidationError", "MissingMandatoryFields");
}
function getActionableForRtgsNeft(request,response){
    var neftArr = ["PENDING", "PENDING FOR PROCESSING", "FAILURE", "DUPLICATE", "SUCCESS"];
    var rtgsArr = ["FAILURE", "SUCCESS"];
    if(response.hasOwnProperty("STATUS") && response.hasOwnProperty("RESPONSE")){
        if(response.RESPONSE=="SUCCESS" && response.STATUS == "PENDING"){
            return "PENDING - CHECK STATUS API";
        }else  if(response.RESPONSE=="SUCCESS" && response.STATUS == "PENDING FOR PROCESSING"){
            return "SCHEDULED";
        }else  if(response.RESPONSE=="SUCCESS" && response.STATUS == "PENDING FOR APPROVAL"){
            return "APPROVAL PENDING BY CHECKER";
        }else  if(response.RESPONSE=="SUCCESS" && response.STATUS == "SUCCESS" && request.txnType == 'RGS'){
            return "POSTED TO RBI";
        }else  if(response.RESPONSE=="SUCCESS" && response.STATUS == "SUCCESS"){
            return "TRANSACTION SUCCESSFUL";
        }else  if(response.RESPONSE=="FAILURE" && response.STATUS == "SUCCESS"){
            return "PENDING - CHECK STATUS API";
        }else  if(response.RESPONSE=="SUCCESS" && response.STATUS == "FAILURE"){
            return "TRANSACTION FAILED";
        }else  if(response.RESPONSE=="FAILURE" && response.STATUS == "FAILURE"){
            return "TRANSACTION FAILED";
        }else  if(response.RESPONSE=="FAILURE" && response.STATUS == "DUPLICATE"){
            return "DUPLICATE TRANSACTION";
        }else if(response.RESPONSE=="FAILURE" && neftArr.indexOf(response.STATUS) === -1){
             return "PENDING - CHECK STATUS API";
        }else if(rtgsArr.indexOf(response.RESPONSE) === -1){
             return "PENDING - CHECK STATUS API";
        }else{
             return "PENDING - CHECK STATUS API";
        }
    }else if(response.hasOwnProperty("STATUS") && !response.hasOwnProperty("RESPONSE")){
        return "PENDING - CHECK STATUS API";
    }else if(!response.hasOwnProperty("STATUS") && response.hasOwnProperty("RESPONSE")){
        return "PENDING - CHECK STATUS API";
    }else{
        return "PENDING - CHECK STATUS API";
    }
    
}
function setDbInsertRequest(ifsc, respCode, retailerCode, date, tranRef, remName, status, remMob, benAcc, amt, rrn, remAcc, merName, subMerId, subMerName, va, remark, uuid) {
    var dbInsertRequest = {
        "BEN_BANK_IFSC": ifsc,
        "RESPONSE_CODE": respCode,
        "RETAILER_CODE": retailerCode,
        "DATETIME" : date,
        "TRANSACTION_REF": tranRef,
        "REM_NAME": remName,
        "STATUS": status,
        "REM_MOBILE": remMob,
        "BEN_ACCOUNT": benAcc,
        "AMOUNT": amt,
        "BANK_RRN": rrn,
        "REM_ACC": remAcc,
        "MERCHANTNAME": merName,
        "SUBMERCHANTID": subMerId,
        "SUBMERCHANTNAME": subMerName,
        "PAYERVA": va,
        "REMARK": remark,
        "UUID": uuid
    };
    context.setVariable("insertToDatabase", true);
    context.setVariable("dbInsertRequest", JSON.stringify(dbInsertRequest));
    context.setVariable("dbInsertURL", "api/v1/local/composite/mis");
}

function MaskData(str, start, end) {
   if (!str || start < 0 || start >= str.length || end < 0 || end > str.length || start >= end) {
      return str;
   }
   const maskLength = end - start;
   const maskedStr = str.substring(0, start) + "X".repeat(maskLength) + str.substring(end);
   return maskedStr;
}

function validateRequest() {
    if(priorityHeader.indexOf('1') != -1) {
        if((priorityHeader.indexOf('3') != -1 || priorityHeader.indexOf('4') != -1) && priorityHeader.indexOf('2') == -1)
            setError("ValidationError", "MissingMandatoryFields");
        if(priorityHeader.indexOf('4') != -1 && priorityHeader.indexOf('3') == -1)
            setError("ValidationError", "MissingMandatoryFields");
    }else if(priorityHeader == "BULK"){
    }else if(priorityHeader == "WFIMPS"){
    }
	else if(priorityHeader == "ineft"){
    }else
        setError("ValidationError", "MissingMandatoryFields");
        

    if(validateFieldsForTransactionType.indexOf('UPI') != -1) {
        mandatoryUPIParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
    if(validateFieldsForTransactionType.indexOf('IMPS') != -1) {
        print(JSON.stringify(request));
        mandatoryIMPSParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
    if(validateFieldsForTransactionType.indexOf('NEFT') != -1) {
        mandatoryNEFTParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
    if(validateFieldsForTransactionType.indexOf('RTGS') != -1) {
        mandatoryRTGSParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
    if(validateFieldsForTransactionType.indexOf('BULK') != -1) {
        mandatoryBulkParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
    if(validateFieldsForTransactionType.indexOf('CIBIM') != -1) {
        mandatoryWFIMPSParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter])){
                print("WFIMPS" + parameter);
                setError("ValidationError", "MissingMandatoryFields");
            }
        });
    }
	if(validateFieldsForTransactionType.indexOf('ineft') != -1) {
        mandatoryineftParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
}

function setTransactionPriority() {
    if(checkIfEmpty(priorityHeader))
        setError("ValidationError", "MissingMandatoryFields");
    if(priorityHeader.indexOf("1") != -1) {
        priorityObject.priority1 = priorityArr[priorityHeader.indexOf("1")];
        validateFieldsForTransactionType = validateFieldsForTransactionType + priorityArr[priorityHeader.indexOf("1")];
    }
    if(priorityHeader.indexOf("2") != -1) {
        priorityObject.priority2 = priorityArr[priorityHeader.indexOf("2")];
        validateFieldsForTransactionType = validateFieldsForTransactionType + "," + priorityArr[priorityHeader.indexOf("2")];
    }
    if(priorityHeader.indexOf("3") != -1) {
        priorityObject.priority3 = priorityArr[priorityHeader.indexOf("3")];
        validateFieldsForTransactionType = validateFieldsForTransactionType + "," + priorityArr[priorityHeader.indexOf("3")];
    }
    if(priorityHeader.indexOf("4") != -1) {
        priorityObject.priority4 = priorityArr[priorityHeader.indexOf("4")];
        validateFieldsForTransactionType = validateFieldsForTransactionType + "," + priorityArr[priorityHeader.indexOf("4")];
    }
    if(priorityHeader.toLowerCase() == "bulk"){
        priorityObject.priority1 = "BULK";
        validateFieldsForTransactionType = validateFieldsForTransactionType + "," + "BULK";
    }
    if(priorityHeader.toLowerCase() == "wfimps"){
        priorityObject.priority1 = "CIBIM";
        validateFieldsForTransactionType = validateFieldsForTransactionType + "," + "CIBIM";
    }
	if(priorityHeader.toLowerCase() == "ineft"){
        priorityObject.priority1 = "ineft";
        validateFieldsForTransactionType = validateFieldsForTransactionType + "," + "ineft";
    }
    print("validateFieldsForTransactionType" +validateFieldsForTransactionType);
}

function resolveRetry() {
    if(priorityObject.hasOwnProperty('priority2')) {
        if(priorityObject.hasOwnProperty('priority3')) {
            if(priorityObject.hasOwnProperty('priority4')) {
                if(priorityObject.priorityStage !== "allDown")
                    context.setVariable("retry", true);
                else
                    setError("RetryLimitReached", "AllBackendsDown");
            }
            else if(priorityObject.priorityStage !== "priority4")
                context.setVariable("retry", true);
            else
                setError("RetryLimitReached", "AllBackendsDown");
        }
        else if(priorityObject.priorityStage !== "priority3")
            context.setVariable("retry", true);
        else
            setError("RetryLimitReached", "AllBackendsDown");
    }
    else if(priorityObject.priorityStage !== "priority2")
        context.setVariable("retry", true);
    else
        setError("RetryLimitReached", "AllBackendsDown");
}
function setNodalRequest() {
    var smsCrpId, smsCrpUsr, smsBnfAccNo;
    var priority = priorityArr[priorityHeader.indexOf("1")];
    if(priorityObject.priorityStage === "priority2" || priorityObject.priorityStage === "checkNodal2")
        priority = priorityArr[priorityHeader.indexOf("2")];
    else if(priorityObject.priorityStage === "priority3")
        priority = priorityArr[priorityHeader.indexOf("3")];
    else if(priorityObject.priorityStage === "priority3")
        priority = priorityArr[priorityHeader.indexOf("3")];
        
    if(priority === "IMPS" || priority === "NEFT"  || priorityHeader === "ineft" || priorityHeader === "BULK" || priorityHeader === "WFIMPS") {
        if(checkIfEmpty(request.crpId) || checkIfEmpty(request.crpUsr) || checkIfEmpty(request.beneAccNo))
            setError("ValidationError", "MissingNodalFields");
        else {
            smsCrpId = request.crpId;
            smsCrpUsr = request.crpUsr;
            smsBnfAccNo = request.beneAccNo;
        }
    }
    else if(priority === "UPI") {
         if(checkIfEmpty(request.crpID) || checkIfEmpty(request.userID) || checkIfEmpty(request.vpa) || checkIfEmpty(request.aggrID))
            setError("ValidationError", "MissingNodalFields");
        else {
            corpID = request.crpID;
            userID = request.userID;
            vpa = request.vpa;
            aggrID = request.aggrID;
        }
    }
    // else if(priority === "UPI") {
    //      if(checkIfEmpty(request.crpID) || checkIfEmpty(request.userID) ||  checkIfEmpty(request.aggrID))
    //         setError("ValidationError", "MissingNodalFields");
    //     else {
    //         corpID = request.crpID;
    //         userID = request.userID;
    //         vpa = request['payer-va'],
    //         aggrID = request.aggrID;
    //     }
    // }
    else if(priority === "RTGS") {
        if(checkIfEmpty(request.CORPID) || checkIfEmpty(request.USERID) || checkIfEmpty(request.CREDITACC))
            setError("ValidationError", "MissingNodalFields");
        else {
            smsCrpId = request.CORPID;
            smsCrpUsr = request.USERID;
            smsBnfAccNo = request.CREDITACC;
        }
    }
    
    if(priority === "UPI") {
        var upiBeneQuery = "smsRequestFrom=CSAM&smsRequestId=BENEVVPA&BANK_ID=ICI&CORP_ID="  +corpID+ "&AGGR_ID=" +aggrID+ "&USER_ID=" +userID + "&VPA=" +vpa;
        context.setVariable("upiBeneQuery", upiBeneQuery);
    } else {
        var beneQuery = "Action.SMS.Init.001=Y&smsBankId=ICI&REQUESTFROM=AGTR&REQUESTTYPE=AGRBEN&smsCrpId=" + smsCrpId + "&smsCrpUsr=" + smsCrpUsr + "&smsBnfAccNo=" + smsBnfAccNo;
        context.setVariable("beneQuery", beneQuery);
    }
    
    // for composite v2 API
    if(context.getVariable("proxy.basepath") === "/api/v2/composite-payment" && priority !== "UPI") {
        var smsAggrId = "";
        if(request.hasOwnProperty('AGGRID'))
            smsAggrId = request.AGGRID;
        else if(request.hasOwnProperty('aggrID'))
            smsAggrId = request.aggrID;
        else if(request.hasOwnProperty('aggrId'))
            smsAggrId = request.aggrId;
        
        if(smsAggrId === "")
            setError("ValidationError", "MissingNodalFields");
            
        var beneQuery = "Action.SMS.Init.001=Y&smsBankId=ICI&REQUESTFROM=AGTR&REQUESTTYPE=BENEAGRVAL&smsCrpId=" + smsCrpId + "&smsCrpUsr=" + smsCrpUsr + "&smsBnfAccNo=" + smsBnfAccNo + "&smsAggrId=" + smsAggrId;
        context.setVariable("beneQuery", beneQuery);
    }
    
    context.setVariable("validateBeneficiary", true);
}

function setCalloutRequest() {
    var priority = "";
    print(JSON.stringify(priorityObject));
    if(priorityObject.priorityStage === "allDown")
        priority = priorityObject['priority4'];
    else
        priority = priorityObject[priorityObject.priorityStage];
    print("inside setcallout"+priority);
    if(priority === "UPI")
        setUPICalloutRequest();
    else if(priority === "IMPS")
        setIMPSCalloutRequest();
    else if(priority === "NEFT")
        setNEFTCalloutRequest();
    else if(priority === "RTGS")
        setRTGSCalloutRequest();
    else if(priority === "BULK")
        setBULKCalloutRequest();
	else if(priority === "ineft")
        setINEFTCalloutRequest();
    else if(priority === "CIBIM")
        setWFIMPSCalloutRequest();
}

function setWFIMPSCalloutRequest() {
    inputRequest = {
        "CORPID" : request.CORPID,
        "USERID" : request.USERID,
        "AGGRID" : request.AGGRID,
        "URN" : request.URN,
        "AGGRNAME" : request.AGGRNAME,
        "UNIQUEID" : request.UNIQUEID,
        "DEBITACC" : request.DEBITACC,
        "CREDITACC" : request.CREDITACC,
        "AMOUNT" : request.AMOUNT,
        "IFSC" : request.IFSC,
        "TXNTYPE" : request.TXNTYPE,
        "PAYEENAME" : request.PAYEENAME,
        "REMARKS" : request.REMARKS,
        "CURRENCY" : "INR",
		"WORKFLOW_REQD":request.WORKFLOW_REQD
    };
	if(request.hasOwnProperty('OTP') && !checkIfEmpty(request.OTP)){
        inputRequest['OTP']=request.OTP;
	}
	if(request.hasOwnProperty('CUSTOMERINDUCED') && !checkIfEmpty(request.CUSTOMERINDUCED)){
        inputRequest['CUSTOMERINDUCED']=request.CUSTOMERINDUCED;
	}
    urlEncodeRequest();
    context.setVariable("wfimpsCalloutRequest", calloutRequest);
    calloutURL = "api/v1/local/composite/wfimps";
}
function setBULKCalloutRequest() {
    inputRequest = {
        "AGGR_ID" : request.AGGR_ID,
        "CORP_ID" : request.CORP_ID,
        "USER_ID" : request.USER_ID,
        "URN" : request.URN,
        "AGGR_NAME" : request.AGGR_NAME,
        "UNIQUE_ID" : request.UNIQUE_ID,
        "FILE_DESCRIPTION" : request.FILE_DESCRIPTION,
        "FILE_TYPE" : "MDC",
        "ISENCRYPTED" : "N",
        "ISAGGRAPI" : "Y",
        "CURRENCY" : "INR",
        "AGOTP" : request.AGOTP,
        "FILE_NAME" : request.FILE_NAME,
        "FILE_CONTENT" : request.FILE_CONTENT,
        // "beneIFSC" :request.beneIFSC
    };
    urlEncodeRequest();
    context.setVariable("bulkCalloutRequest", calloutRequest);
    calloutURL = "api/v1/local/composite/bulk";
}
function setINEFTCalloutRequest() {
    inputRequest = context.getVariable("request.content");
    inputRequest = JSON.parse(inputRequest);
    if(inputRequest.hasOwnProperty("beneIFSC")){
        var beneifsc = inputRequest.beneIFSC;
        if(isinValidString(beneifsc)){
            setError("Invalidrequest", "Invalidrequest");
            throw "Invalidrequest";
        }
    }
    context.setVariable("ineftCalloutRequest",calloutRequest);
     calloutURL = "api/v1/local/composite/ineft";
}
function isinValidString(str) {
  const regex = /^ICIC\d{7}$/; // Matches "abcd" followed by exactly 7 digits
  return regex.test(str);
}
function setUPICalloutRequest() {
    var initiation_mode = request['initiation-mode'];
    print("initiation_mode" +initiation_mode);
    
	var purpose = request.purpose;
	var refID = request['ref-id'];
	var payeemcc = request['payee-mcc'];

	if ((initiation_mode != null) && (initiation_mode!=undefined)) {
	    print("initiation_mode" +initiation_mode);
	}else{
	    initiation_mode = "00";
	}
	if ((purpose != null) && (purpose!=undefined)) {
	    purpose = request.purpose;
	}else{
	    purpose = "00";
	}
	
	print("initiation-mode "+initiation_mode);
    if ((refID != null) && (refID!=undefined)) {
    inputRequest = {
        "mobile" : request['mobile'],
        "device-id" : request['device-id'],
        "seq-no" : request['seq-no'],
        "payer-va" : request['payer-va'],
        "profile-id" : request['profile-id'],
        "amount" : request['amount'],
        "channel-code" : request['channel-code'],
        "note" : request['remarks'],
        "account-provider" : request['account-provider'],
        "payee-va":request['payee-va'],
        "use-default-acc":request['use-default-acc'],
        "pre-approved":request['pre-approved'],
        "default-debit":request['default-debit'],
        "default-credit":request['default-credit'],
        "payee-name":request['payee-name'],
        "mcc":request['mcc'],
        "merchant-type":request['merchant-type'],
        "txn-type":request['txn-type'],
        "initiation-mode" : initiation_mode,
        "purpose" : purpose,
        "ref-id" : refID
        
    };
    }else{
     inputRequest = {
        "mobile" : request['mobile'],
        "device-id" : request['device-id'],
        "seq-no" : request['seq-no'],
        "payer-va" : request['payer-va'],
        "profile-id" : request['profile-id'],
        "amount" : request['amount'],
        "channel-code" : request['channel-code'],
        "note" : request['remarks'],
        "account-provider" : request['account-provider'],
        "payee-va":request['payee-va'],
        "use-default-acc":request['use-default-acc'],
        "pre-approved":request['pre-approved'],
        "default-debit":request['default-debit'],
        "default-credit":request['default-credit'],
        "payee-name":request['payee-name'],
        "mcc":request['mcc'],
        "merchant-type":request['merchant-type'],
        "txn-type":request['txn-type'],
        "initiation-mode" : initiation_mode,
        "purpose" : purpose
    };    
    }
    if(request.hasOwnProperty('PtcMobile') && !checkIfEmpty(request.PtcMobile)){
        inputRequest['PtcMobile']=request.PtcMobile;
     }
    if ((payeemcc != null) && (payeemcc !=undefined)) {
	   inputRequest['payee-mcc'] = payeemcc;
     }
    inputRequest['channel-code'] = "MICICI";
    inputRequest['use-default-acc'] = "D";
    inputRequest['pre-approved'] = "P";
    inputRequest['default-debit'] = "N";
    inputRequest['default-credit'] = "N";
    inputRequest['merchant-type'] = "ENTITY";
    inputRequest['txn-type'] = "merchantToPersonPay";
    
    inputRequest['app-id'] = "com.icicibank.micici";
    inputRequest.ip = context.getVariable("proxy.client.ip");
    inputRequest["device-type"] = "INET";
    inputRequest.os = "Android";
    if(request.hasOwnProperty("capability") && !checkIfEmpty(request.capability)){
        var capability = request.capability;
        var capregex = /^[a-zA-Z0-9]{31}          $/; //31 chars and 10 spaces at the end
        if(!capregex.test(capability)){
            setError("Invalidrequest", "Invalidrequest");
             throw "Invalidrequest";
        }
        inputRequest.capability = request.capability;
    }else{
         inputRequest.capability = "5200000000000004000639292929292          ";
    }
    //inputRequest.ID = request['device-id'];
    
     
     
    urlEncodeRequest();
    context.setVariable("upiCalloutRequest", calloutRequest);
    calloutURL = "api/v1/local/composite/upi";
    if(basepath === "/api/v4/composite-payment"){
        if(parseInt(request.amount) > parseInt(maxAmount)){
            print("request.amount" + request.amount);
            print("maxAmount" + maxAmount);
        setError("InvalidMaxAmount", "InvalidMaxAmount");
        throw "InvalidMaxAmount";
    }
    }
}

function setIMPSCalloutRequest() {
     var settlementID = request.SettlementID;
     var benemobileno = "";
     var benemmid = "";
     if(request.hasOwnProperty("BeneMobileNo") && !checkIfEmpty(request.BeneMobileNo)){
         benemobileno = request.BeneMobileNo;
     }
     if(request.hasOwnProperty("BeneMMID") && !checkIfEmpty(request.BeneMMID)){
         benemmid = request.BeneMMID;
     }
     
	if ((settlementID != null) && (settlementID!=undefined)) {
	    
         context.setVariable("settlementID", settlementID.length);
	        if(settlementID.length > 50) {
		        setError("ValidationError", "LengthOfSettlementIDExceeded");
        	}
        	else {
        		inputRequest = {
                "TransactionDate" : request.localTxnDtTime,
                "BeneAccNo" : request.beneAccNo,
                "BeneIFSC" : request.beneIFSC,
                "Amount" : request.amount,
                "TranRefNo" : request.tranRefNo,
                "PaymentRef" : request.paymentRef,
                "RemName" : request.senderName,
                "RemMobile" : request.mobile,
                "RetailerCode" : request.retailerCode,
                "PassCode" : request.passCode,
                "SettlementID" : settlementID
            };
        	}
	}
	else {
        inputRequest = {
            "TransactionDate" : request.localTxnDtTime,
            "BeneAccNo" : request.beneAccNo,
            "BeneIFSC" : request.beneIFSC,
            "Amount" : request.amount,
            "TranRefNo" : request.tranRefNo,
            "PaymentRef" : request.paymentRef,
            "RemName" : request.senderName,
            "RemMobile" : request.mobile,
            "RetailerCode" : request.retailerCode,
            "PassCode" : request.passCode
        };
	}
	if(!checkIfEmpty(benemobileno) && checkIfEmpty(benemmid) && checkIfEmpty(request.beneAccNo) && checkIfEmpty(request.beneIFSC)){
        setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(checkIfEmpty(benemobileno) && !checkIfEmpty(benemmid) && checkIfEmpty(request.beneAccNo) && checkIfEmpty(request.beneIFSC)){
	    setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(checkIfEmpty(benemobileno) && checkIfEmpty(benemmid) && !checkIfEmpty(request.beneAccNo) && checkIfEmpty(request.beneIFSC)){
	    setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(checkIfEmpty(benemobileno) && checkIfEmpty(benemmid) && checkIfEmpty(request.beneAccNo) && !checkIfEmpty(request.beneIFSC)){
	    setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(checkIfEmpty(benemobileno) && checkIfEmpty(benemmid) && checkIfEmpty(request.beneAccNo) && checkIfEmpty(request.beneIFSC)){
	    setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(!checkIfEmpty(benemobileno) && !checkIfEmpty(benemmid) && !checkIfEmpty(request.beneAccNo) && !checkIfEmpty(request.beneIFSC)){
        setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(!checkIfEmpty(benemobileno) && !checkIfEmpty(benemmid) && !checkIfEmpty(request.beneAccNo) && checkIfEmpty(request.beneIFSC)){
        setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(!checkIfEmpty(benemobileno) && !checkIfEmpty(benemmid) && checkIfEmpty(request.beneAccNo) && !checkIfEmpty(request.beneIFSC)){
        setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(!checkIfEmpty(benemobileno) && checkIfEmpty(benemmid) && !checkIfEmpty(request.beneAccNo) && !checkIfEmpty(request.beneIFSC)){
        setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(checkIfEmpty(benemobileno) && !checkIfEmpty(benemmid) && !checkIfEmpty(request.beneAccNo) && !checkIfEmpty(request.beneIFSC)){
        setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(!checkIfEmpty(benemobileno) && checkIfEmpty(benemmid) && !checkIfEmpty(request.beneAccNo) && checkIfEmpty(request.beneIFSC)){
        setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(checkIfEmpty(benemobileno) && !checkIfEmpty(benemmid) && !checkIfEmpty(request.beneAccNo) && checkIfEmpty(request.beneIFSC)){
        setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(!checkIfEmpty(benemobileno) && checkIfEmpty(benemmid) && checkIfEmpty(request.beneAccNo) && !checkIfEmpty(request.beneIFSC)){
        setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}else if(checkIfEmpty(benemobileno) && !checkIfEmpty(benemmid) && checkIfEmpty(request.beneAccNo) && !checkIfEmpty(request.beneIFSC)){
        setError("Invalidrequest", "Invalidrequest");
        throw "Invalidrequest";
	}
	
	if(!checkIfEmpty(benemobileno) && !checkIfEmpty(benemmid)){
	    inputRequest.BeneMobileNo = benemobileno;
	    inputRequest.BeneMMID = benemmid;
	}
	inputRequest.TransactionDate = getDateTime();
    urlEncodeRequest();
    context.setVariable("impsCalloutRequest", calloutRequest);
    calloutURL = "api/v1/local/composite/imps";
    context.setVariable("bcID", request.bcID);
    if(basepath === "/api/v4/composite-payment"){
         if(parseInt(request.amount) > parseInt(maxAmount)){
        setError("InvalidMaxAmount", "InvalidMaxAmount");
        throw "InvalidMaxAmount";
    }
    }
}

function setNEFTCalloutRequest() {
   
    var beneNameUpdatedVal = "";
    if(request.hasOwnProperty("beneName")){
        var maxLength = 80;
        var str = request.beneName;
        if (str.length > maxLength) {
            beneNameUpdatedVal = str.substring(0, maxLength);
        }else{
            beneNameUpdatedVal = request.beneName;
        }
    }else{
        beneNameUpdatedVal = request.beneName;
    }
    inputRequest = {
        "AGGRID" : request.aggrId,
        "CORPID" : request.crpId,
        "USERID" : request.crpUsr,
        "URN" : request.urn,
        "AGGRNAME" : request.aggrName,
        "UNIQUEID" : request.tranRefNo,
        "DEBITACC" : request.senderAcctNo,
        "CREDITACC" : request.beneAccNo,
        "IFSC" : request.beneIFSC,
        "AMOUNT" : request.amount,
        "TXNTYPE" : request.txnType,
        "PAYEENAME" : beneNameUpdatedVal,
        "REMARKS" : request.narration1,
        "CURRENCY" : "INR"
        };
        var amount = request.amount;
		if(amount >= 500000000){
			if(!request.hasOwnProperty('BENLEI')){
				setError("BeneLEINotEntered", "BeneLEINotEntered");
				throw "BeneLEINotEntered";
			}else if(request.hasOwnProperty('BENLEI') && splitString(request.BENLEI) === false){
				setError("BeneLEIIncorrect", "BeneLEIIncorrect");
				throw "BeneLEIIncorrect";
			}
			if(request.hasOwnProperty('BENLEI') && amount >= 500000000){
			     inputRequest.BENLEI = request.BENLEI;
			}
		}
		
    if(request.hasOwnProperty('WORKFLOW_REQD') && !checkIfEmpty(request.WORKFLOW_REQD))
        inputRequest.WORKFLOW_REQD = request.WORKFLOW_REQD;
    urlEncodeRequest();
    context.setVariable("neftCalloutRequest", calloutRequest);
    calloutURL = "api/v1/local/composite/neft";
    if(basepath === "/api/v4/composite-payment"){
        if(parseInt(request.amount) > parseInt(maxAmount)){
        setError("InvalidMaxAmount", "InvalidMaxAmount");
        throw "InvalidMaxAmount";
    }
    }
}

function setRTGSCalloutRequest() {
    if(Object.keys(priorityObject).length > 2) {
        
        var beneNameUpdatedVal = "";
        if(request.hasOwnProperty("PAYEENAME")){
            var maxLength = 80;
            var str = request.PAYEENAME;
            print("test srt 898"+str);
            if (str.length > maxLength) {
                beneNameUpdatedVal = str.substring(0, maxLength);
            }else{
                beneNameUpdatedVal = request.PAYEENAME;
            }
        }else{
            beneNameUpdatedVal = request.PAYEENAME;
        }
        inputRequest = {
            "AGGRID" : request.AGGRID,
            "CORPID" : request.CORPID,
            "USERID" : request.USERID,
            "URN" : request.URN,
            "AGGRNAME" : request.AGGRNAME,
            "UNIQUEID" : request.UNIQUEID,
            "DEBITACC" : request.DEBITACC,
            "CREDITACC" : request.CREDITACC,
            "IFSC" : request.IFSC,
            "AMOUNT" : request.AMOUNT,
            "CURRENCY" : "INR",
            "TXNTYPE" : request.TXNTYPE,
            "PAYEENAME" : beneNameUpdatedVal,
            "REMARKS" : request.REMARKS
        };
        if(request.hasOwnProperty('WORKFLOW_REQD') && !checkIfEmpty(request.WORKFLOW_REQD))
        inputRequest.WORKFLOW_REQD=request.WORKFLOW_REQD;
    }
    else {
        inputRequest = Object.assign({}, request);
        var beneNameUpdatedVal = "";
        if(request.hasOwnProperty("PAYEENAME")){
            var maxLength = 80;
            var str = request.PAYEENAME;
            print("test srt 898"+str);
            if (str.length > maxLength) {
                beneNameUpdatedVal = str.substring(0, maxLength);
            }else{
                beneNameUpdatedVal = request.PAYEENAME;
            }
        }else{
            beneNameUpdatedVal = request.PAYEENAME;
        }
		print("test beneNameUpdatedVal 907 "+beneNameUpdatedVal);
        
        inputRequest.PAYEENAME = beneNameUpdatedVal;
        inputRequest.CURRENCY = "INR";
    }
    
    var amount = request.AMOUNT;

	if(amount >= 500000000){
		if(!request.hasOwnProperty('BENLEI')){
			setError("BeneLEINotEntered", "BeneLEINotEntered");
			throw "BeneLEINotEntered";
		}else if(request.hasOwnProperty('BENLEI') && splitString(request.BENLEI) === false){
			setError("BeneLEIIncorrect", "BeneLEIIncorrect");
			throw "BeneLEIIncorrect";
		}
		if(request.hasOwnProperty('BENLEI') && amount >= 500000000){
		     inputRequest.BENLEI = request.BENLEI;
		}
	}
    urlEncodeRequest();
    context.setVariable("rtgsCalloutRequest", calloutRequest);
    calloutURL = "api/v1/local/composite/rtgs";
    if(basepath === "/api/v4/composite-payment"){
         if(parseInt(request.amount) > parseInt(maxAmount)){
        setError("InvalidMaxAmount", "InvalidMaxAmount");
        throw "InvalidMaxAmount";
    }
    }
}
function splitString(str){
	var alpha = "";
	var num = "";
	var special = "";
	var check_validation = 0;
	if(str.length != 20){
		return false;
	}
	/*print("check_validation "+ check_validation);*/
	for(var i = 0; i<str.length; i++){
		if(!isNaN(str[i])){
			num +=str[i];
		}else if((str[i] >= 'A' && str[i]<= 'Z') || (str[i] >= 'a' && str[i] <= 'z')){
			alpha = alpha + str[i];
		}else{
			special = special + str[i];
		}
	}
	/*print("num-length "+ num.length);
	print("alpha-length "+ alpha.length);
	print("special-length "+ special.length);*/
	if(num.length === 0){
		check_validation = 1;
	}	
	if(alpha.length === 0){
		check_validation = 1;
	}	
	if(special.length > 0){
		check_validation = 1;
	}
	/*print("64 check_validation "+ check_validation);*/
	if(check_validation === 1){
		return false;
	}
}

function setError(err, cause) {
    context.setVariable("cause", cause);
    context.setVariable("faultName", "ScriptExecutionFailed");
    throw err;
}

function urlEncodeRequest() {
    try {
        var noOfKeys = Object.keys(inputRequest).length;
        var counter = 1;
    
        for (var key in inputRequest) {
            if (counter < noOfKeys)
                calloutRequest = (calloutRequest + (key + "=" + inputRequest[key] + "&"));
            else
                calloutRequest = (calloutRequest + (key + "=" + inputRequest[key]));
            counter++;
        }
    } catch (error) {
        print(error);
        throw "UrlEncodingFailed";
    }
}

function validateBENLEI(benlei)  {   
var regpan = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
var bbenlei = benlei.toString();
if(regpan.test(benlei) && bbenlei.length == 20){
   return true;
}else 
return false;
}

function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}

function escapeXml(unsafe) {
    return unsafe.replace(/["]/g, function(c) {
        switch (c) {
            case '"':
                return '\"';
        }
    });
}

function getDate() {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000 * 5.5));
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    var year = nd.getFullYear();
    // var month = nd.getMonth() < 10 ?  (nd.getMonth() + 1) : (nd.getMonth() + 1);
    var month = nd.getMonth();
    var date = nd.getDate() < 10 ? "0" + nd.getDate() : nd.getDate();
    var hour = nd.getHours() < 10 ? "0" + nd.getHours() : nd.getHours();
    var ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    var min = nd.getMinutes() < 10 ? "0" + nd.getMinutes() : nd.getMinutes();
    var sec = nd.getSeconds() < 10 ? "0" + nd.getSeconds() : nd.getSeconds();
    var milliSec = nd.getMilliseconds();

    var finalDate = addZero(date) + "-" + monthNames[month] + "-" + year.toString().substr(-2) + " " + addZero(hour) + "." + addZero(min) + "."+ addZero(sec) + "." + milliSec + " " + ampm;
    return finalDate.toString();
}

function addZero(field) {
    if(field.toString().length == 1)
	    field = "0" + field.toString();
	return field;
}

function getDateTime(){
    var time = context.getVariable("system.timestamp");
    var date = new Date(time + (3600000 * +5.5));
    //var date = new Date(parseInt(timestamp, 10));
    // Format YYYYMMDDHHMMSS
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);
    // Final formatted string
    var formattedDate = year + month + day + hours + minutes + seconds;
    return formattedDate;
}

