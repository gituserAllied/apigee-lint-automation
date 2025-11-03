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
if(context.getVariable("enableEncryption") === false) {
    request = JSON.parse(context.getVariable("request.content"));
}
else if(context.getVariable("enableEncryption") === true || context.getVariable("enableEncryption") === "true"){ 
    request = JSON.parse(context.getVariable("DECODED_DECRYPTED_CONTENT"));
}
var priorityHeader = context.getVariable("request.header.x-priority");
var pathsuffix = context.getVariable("proxy.pathsuffix");
var basepath = context.getVariable("proxy.basepath");

var mandatoryUPIParameters = ["mobile", "device-id", "seq-no", "payer-va", "profile-id", "amount", "channel-code", "remarks", "account-provider"];
var mandatoryIMPSParameters = ["beneAccNo", "beneIFSC", "amount", "tranRefNo", "paymentRef", "senderName", "mobile", "retailerCode", "passCode", "bcID"];
var mandatoryNEFTParameters = ["tranRefNo", "amount", "senderAcctNo", "beneAccNo", "beneName", "beneIFSC", "narration1", "crpId", "crpUsr", "aggrId", "urn", "aggrName", "txnType"];
var mandatoryRTGSParameters = ["AGGRID", "CORPID", "USERID", "URN", "AGGRNAME", "UNIQUEID", "DEBITACC", "CREDITACC", "IFSC", "AMOUNT", "TXNTYPE", "PAYEENAME", "REMARKS", "CURRENCY"];

var priorityArr = ["UPI", "IMPS", "NEFT", "RTGS"];
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
    if(!context.getVariable("isTransactionSuccessful")) {               // execute last JS in the flow
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
                if(context.getVariable("private.isNodal") === "true")
                    setNodalRequest();
                else {
                    priorityObject.priorityStage = "priority1";         // if the merchant is non nodal, we are not doing beneficiary validation. Hence sckip the stage beneciaryValidation and set to priority1
                    context.setVariable("makeTransaction", true);
                    setCalloutRequest();
                }
        }
        else {
            var priority = priorityObject[priorityObject.priorityStage]
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
                            setCalloutRequest();
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
                            setCalloutRequest();
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
                    if(context.getVariable("calloutURL") === "api/v1/local/composite/upi")
                        response = Object.assign({}, calloutResponse);                  // assign response as is in case of UPI
                    else {
                        if(calloutResponse.XML)
                            response = Object.assign({}, calloutResponse.XML);          // extract XML from response and then assign
                        else if(calloutResponse.ImpsResponse)
                            response = Object.assign({}, calloutResponse.ImpsResponse);
                        else
                            response = Object.assign({}, calloutResponse);              // if XML tag not found, assign as is
                    }

                    var lat = Math.floor(context.getVariable("apigee.metrics.policy.SC-TransactionPriority.timeTaken")/1000000);
                    if(priority === "UPI") {
                    //   response.VPA = request.vpa;
                    //   response.AGGR_ID = request.aggrID;
                    //   response.CORP_ID = request.crpID;
                    //   response.USER_ID = request.userID;
                      context.setVariable("upiResponsePayload", JSON.stringify(response));
                      context.setVariable("upiExecutionLatency", lat);
                      context.setVariable("upiResponseStatusCode", context.getVariable("calloutResponse.status.code"));
                    }
                    if(priority === "NEFT") {
                    //   response.AGGR_NAME = request.aggrName;
                    //   response.AGGR_ID = request.aggrId;
                    //   response.CORP_ID = request.crpId;
                    //   response.USER_ID = request.crpUsr;
                      context.setVariable("neftResponsePayload", JSON.stringify(response));
                      context.setVariable("neftExecutionLatency", lat);
                      context.setVariable("neftResponseStatusCode", context.getVariable("calloutResponse.status.code"));
                    }
                    else if(priority === "RTGS") {
                    //   response.AGGR_NAME = request.AGGRNAME;
                    //   response.AGGR_ID = request.AGGRID;
                    //   response.CORP_ID = request.CORPID;
                    //   response.USER_ID = request.USERID;
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
                    
                    // set dbrequest
                   	var date = getDate();
                    context.setVariable("date", date);

                    var remName = context.getVariable("apigee.developer.app.name");
                    var uuid = context.getVariable("messageid");
                    calloutURL = context.getVariable("calloutURL");
                    if(calloutURL === "api/v1/local/composite/upi")
                        setDbInsertRequest("", response.response, "", date, request['seq-no'], remName, response.message, request.mobile, "", request.amount, response.BankRRN, "", remName, "", "", request['payer-va'], request.remarks, uuid);
                    else if(calloutURL === "api/v1/local/composite/imps") 
                        setDbInsertRequest(request.beneIFSC, response.ActCode, request.retailerCode, date, request.tranRefNo, request.senderName, response.Response, request.mobile, request.beneAccNo, request.amount, response.BankRRN, "", remName, "", "", "", request.paymentRef, uuid);
                    else if(calloutURL === "api/v1/local/composite/neft") {
                        var neftRespCode = "";
                        var neftStatus = "SUCCESS";
                        if(response.STATUS !== "SUCCESS" || response.RESPONSE !== "SUCCESS") {
                            neftRespCode = response.ERRORCODE;
                            neftStatus = response.MESSAGE;
                        }
                        setDbInsertRequest(request.beneIFSC, neftRespCode, "", date, request.tranRefNo, remName, neftStatus, "", request.beneAccNo, request.amount, request.URN, request.senderAcctNo, remName, "", "", "", request.narration1, uuid);
                    }
                    else if(calloutURL === "api/v1/local/composite/rtgs") {
                        var rtgsRespCode = "";
                        var rtgsStatus = "SUCCESS";
                        if(response.STATUS !== "SUCCESS" || response.RESPONSE !== "SUCCESS") {
                            rtgsRespCode = response.ERRORCODE;
                            rtgsStatus = response.MESSAGE;
                        }
                        setDbInsertRequest(request.IFSC, rtgsRespCode, "", date, request.UNIQUEID, remName, rtgsStatus, "", request.CREDITACC, request.AMOUNT, request.URN, request.DEBITACC, remName, "", "", "", request.REMARKS, uuid);
                    }
                    if(priority === "IMPS") {
                        print("Line 313 Error Code Wise Block");
                        if(response.ActCode==="901" || response.ActCode==="7" || response.ActCode==="12" || response.ActCode==="18" || response.ActCode==="19" || response.ActCode==="20" || response.ActCode==="24" || response.ActCode==="101"){
                            resolveRetry();
                            print("Inside Error Block" + response.ActCode);
                            setCalloutRequest();
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
                
                 else if(calloutStatusCode == 503) {
                     context.setVariable("retry", false);
                     context.setVariable("isTransactionSuccessful", true);
                     if(priorityObject.priorityStage === "allDown") {
                         context.setVariable("dbOperation", "SKIPPED");
                         setError("RetryLimitReached", "AllBackendsDown");
                     }
                    else
                            setCalloutRequest();
                }
                 else if(calloutStatusCode == 500){
                     if(context.getVariable("calloutResponse.content") === "Requested Service Not Found !!") {
                         //resolveRetry();
                         context.setVariable("isTransactionSuccessful", true);
                         if(priorityObject.priorityStage === "allDown") {
                             context.setVariable("dbOperation", "SKIPPED");
                             setError("RetryLimitReached", "AllBackendsDown");
                         }
                         if(priorityObject.priorityStage === "priority2" && priorityObject.hasOwnProperty('priority2')) {
                             priorityObject.priorityStage = "checkNodal2";
                             setNodalRequest();                                  // validate beneficiary if priority1 was UPI and that failed
                         }
                         else {
                             setCalloutRequest();
                         }
                     }
                     else {
                         print("Else block at line 352");
                         context.setVariable("retry", false);
                         var callout = JSON.parse(context.getVariable("calloutResponse.content"));
                         if(callout.errorCode === "APIGEE_FAILURE") {
                             context.setVariable("debugError", callout.response);
                             setError("ApigeeError", "DefaultError");
                         }
                     }
                }else {
                    //resolveRetry();
                    context.setVariable("isTransactionSuccessful", true);
                    if(priorityObject.priorityStage === "allDown") {
                        context.setVariable("dbOperation", "SKIPPED");
                        setError("RetryLimitReached", "AllBackendsDown");
                    }
                    else
                        setCalloutRequest();
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

function validateRequest() {
    if(priorityHeader.indexOf('1') != -1) {
        if((priorityHeader.indexOf('3') != -1 || priorityHeader.indexOf('4') != -1) && priorityHeader.indexOf('2') == -1)
            setError("ValidationError", "MissingMandatoryFields");
        if(priorityHeader.indexOf('4') != -1 && priorityHeader.indexOf('3') == -1)
            setError("ValidationError", "MissingMandatoryFields");
    }
    else
        setError("ValidationError", "MissingMandatoryFields");

    if(validateFieldsForTransactionType.indexOf('UPI') != -1) {
        mandatoryUPIParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
    if(validateFieldsForTransactionType.indexOf('IMPS') != -1) {
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
        
    if(priority === "IMPS" || priority === "NEFT") {
        if(checkIfEmpty(request.crpId) || checkIfEmpty(request.crpUsr) || checkIfEmpty(request.beneAccNo))
            setError("ValidationError", "MissingNodalFields");
        else {
            smsCrpId = request.crpId;
            smsCrpUsr = request.crpUsr;
            smsBnfAccNo = request.beneAccNo;
        }
    }
    else if(priority === "UPI") {
         if(checkIfEmpty(request.crpID) || checkIfEmpty(request.userID) || checkIfEmpty(request.payee-va) || checkIfEmpty(request.aggrID))
            setError("ValidationError", "MissingNodalFields");
        else {
            corpID = request.crpID;
            userID = request.userID;
            vpa = request.payee-va;
            aggrID = request.aggrID;
        }
    }
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
    if(priorityObject.priorityStage === "allDown")
        priority = priorityObject['priority4'];
    else
        priority = priorityObject[priorityObject.priorityStage];
    print(priority)
    if(priority === "UPI")
        setUPICalloutRequest();
    else if(priority === "IMPS")
        setIMPSCalloutRequest();
    else if(priority === "NEFT")
        setNEFTCalloutRequest();
    else if(priority === "RTGS")
        setRTGSCalloutRequest();
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
    if(request.hasOwnProperty('Payee_MCC') && !checkIfEmpty(request.Payee_MCC)){
        inputRequest['Payee_MCC']=request.Payee_MCC;
     } 
     if ((payeemcc != null) && (payeemcc !=undefined)) {
	   inputRequest['payee-mcc'] = payeemcc;
     }
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
   
    /*else
        request.WORKFLOW_REQD = "N"*/
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
        "PAYEENAME" : request.beneName,
        "REMARKS" : request.narration1,
        "CURRENCY" : "INR"
        };
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
            "PAYEENAME" : request.PAYEENAME,
            "REMARKS" : request.REMARKS
        };
        if(request.hasOwnProperty('WORKFLOW_REQD') && !checkIfEmpty(request.WORKFLOW_REQD))
        inputRequest.WORKFLOW_REQD=request.WORKFLOW_REQD;
    }
    else {
        inputRequest = Object.assign({}, request);
        inputRequest.CURRENCY = "INR";
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

function setError(err, cause) {
    context.setVariable("cause", cause);
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
