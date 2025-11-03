try {
    var priorityHeader = context.getVariable("request.header.x-priority");
    var myreq = "";
    var myres = "";
    var config = {};
    config = JSON.parse(context.getVariable("private.merchantConfig"));
    context.setVariable("enableEncryption", config.enableEncryption);
    if(context.getVariable("enableEncryption") === false) {
        myreq = JSON.parse(context.getVariable("request.content"));
    }
    else if(context.getVariable("enableEncryption") === true || context.getVariable("enableEncryption") === "true"){ 
        myreq = JSON.parse(context.getVariable("DECODED_DECRYPTED_CONTENT"));
    }
    myres = JSON.parse(context.getVariable("message.content"));
    // myres = JSON.parse(context.getVariable("finalResponse"));
    
    context.setVariable("plainReqError", false); 
    var error = 0;
    var errorstr = "";
    context.setVariable("x-priority", "");
    /*UPI*/
    /*request*/
    context.setVariable("amount", "");
    context.setVariable("txn_type", "");
    context.setVariable("payee_va", "");
    context.setVariable("payer_va", "");
    /*request*/
    /*response*/
    context.setVariable("success", "");
    context.setVariable("upi_response", "");
    context.setVariable("upi_message", "");
    context.setVariable("BankRRN", "");
    context.setVariable("SeqNo", "");
    context.setVariable("PayerRespCode", "");
    context.setVariable("PayeeRespCode", "");
    /*response*/
    /*UPI*/
    /*IMPS*/
    /*request*/
    context.setVariable("beneAccNo", "");
    context.setVariable("beneIFSC", "");
    context.setVariable("amount", "");
    context.setVariable("tranRefNo", "");
    context.setVariable("paymentRef", "");
    context.setVariable("bcID", "");
    /*request*/
    /*response*/
    context.setVariable("ActCode", "");
    context.setVariable("imps_Response", "");
    context.setVariable("BankRRN", "");
    context.setVariable("BeneName", "");
    context.setVariable("success", "");
    context.setVariable("TransRefNo", "");
    /*response*/
    /*IMPS*/
    /*NEFT*/
    /*request*/
    context.setVariable("amount", "");
    context.setVariable("tranRefNo", "");
    context.setVariable("beneIFSC", "");
    context.setVariable("txnType", "");
    context.setVariable("aggrId", "");
    context.setVariable("urn", "");
    context.setVariable("senderAcctNo", "");
    context.setVariable("beneAccNo", "");
    /*request*/
    /*response*/
    context.setVariable("neft_MESSAGE", "");
    context.setVariable("ERRORCODE", "");
    context.setVariable("RESPONSECODE", "");
    context.setVariable("STATUS", "");
    context.setVariable("neft_RESPONSE", "");
    /*response*/
    /*NEFT*/
    context.setVariable("x-priority", priorityHeader);
    if(priorityHeader == '1000'){
        /* Request */
        var amount = "";
        var txn_type = "";
        var payee_va = "";
        var payer_va = "";
        if(myreq.hasOwnProperty('amount')){
            amount = myreq.amount;
            context.setVariable("amount", amount);
        }
        if(myreq.hasOwnProperty('txn-type')){
            txn_type = myreq['txn-type'];
            context.setVariable("txn_type", txn_type);
        }
        if(myreq.hasOwnProperty('payee-va')){
            payee_va = myreq['payee-va'];
            context.setVariable("payee_va", payee_va);
        }
        if(myreq.hasOwnProperty('payer-va')){
            payer_va = myreq['payer-va'];
            context.setVariable("payer_va", payer_va);
        }
        /* Request */
        /* Response */
        var success = "";
        var response = "";
        var message = "";
        var BankRRN = "";
        var SeqNo = "";
        var PayerRespCode = "";
        var PayeeRespCode = "";
        if(myres.hasOwnProperty('success')){
             success = myres.success;
             context.setVariable("success", success);
        }
        if(myres.hasOwnProperty('response')){
             response = myres.response;
             context.setVariable("upi_response", response);
        }
        if(myres.hasOwnProperty('message')){
             response = myres.message;
             context.setVariable("upi_message", message);
        }
        if(myres.hasOwnProperty('BankRRN')){
             BankRRN = myres.BankRRN;
             context.setVariable("BankRRN", BankRRN);
        }
        if(myres.hasOwnProperty('SeqNo')){
             SeqNo = myres.SeqNo;
             context.setVariable("SeqNo", SeqNo);
        }
        if(myres.hasOwnProperty('PayerRespCode')){
             PayerRespCode = myres.PayerRespCode;
             context.setVariable("PayerRespCode", PayerRespCode);
        }
        /* Response */
    }else if(priorityHeader == '0100'){
         /* Request */
        var beneAccNo = "";
        var beneIFSC = "";
        var amount = "";
        var tranRefNo = "";
        var paymentRef = "";
        var bcID = "";
        if(myreq.hasOwnProperty('beneAccNo')){
        	beneAccNo = myreq.beneAccNo;
        	context.setVariable("amount", amount);
        }
        if(myreq.hasOwnProperty('beneIFSC')){
        	beneIFSC = myreq.beneIFSC;
        	context.setVariable("beneIFSC", beneIFSC);
        }
        if(myreq.hasOwnProperty('amount')){
        	amount = myreq.amount;
        	context.setVariable("amount", amount);
        }
        if(myreq.hasOwnProperty('tranRefNo')){
        	tranRefNo = myreq.tranRefNo;
        	context.setVariable("tranRefNo", tranRefNo);
        }
        if(myreq.hasOwnProperty('paymentRef')){
        	paymentRef = myreq.paymentRef;
        	context.setVariable("paymentRef", paymentRef);
        }
        if(myreq.hasOwnProperty('bcID')){
        	bcID = myreq.bcID;
        	context.setVariable("bcID", bcID);
        }
        /* Request */
        /* Response */
        var ActCode = "";
        var Response = "";
        var BankRRN = "";
        var BeneName = "";
        var success = "";
        var TransRefNo = "";
        
        if(myres.hasOwnProperty('ActCode')){
        	ActCode = myres.ActCode;
        	context.setVariable("ActCode", ActCode);
        }
        if(myres.hasOwnProperty('Response')){
        	Response = myres.Response;
        	context.setVariable("imps_Response", Response);
        }
        if(myres.hasOwnProperty('BankRRN')){
        	BankRRN = myres.BankRRN;
        	context.setVariable("BankRRN", BankRRN);
        }
        if(myres.hasOwnProperty('BeneName')){
        	BeneName = myres.BeneName;
        	context.setVariable("BeneName", BeneName);
        }
            if(myres.hasOwnProperty('success')){
            	success = myres.success;
            	context.setVariable("success", success);
            }
        if(myres.hasOwnProperty('TransRefNo')){
        	TransRefNo = myres.TransRefNo;
        	context.setVariable("TransRefNo", TransRefNo);
        }
        /* Response */
    }else if(priorityHeader == '0010'){
         /* Request */
        var amount = "";
        var tranRefNo = "";
        var beneIFSC = "";
        var txnType = "";
        var aggrId = "";
        var urn = "";
        var senderAcctNo = "";
        var beneAccNo = "";
        if(myreq.hasOwnProperty('amount')){
        	amount = myreq.amount;
        	context.setVariable("amount", amount);
        }
        if(myreq.hasOwnProperty('tranRefNo')){
        	tranRefNo = myreq.tranRefNo;
        	context.setVariable("tranRefNo", tranRefNo);
        }
        if(myreq.hasOwnProperty('beneIFSC')){
        	beneIFSC = myreq.beneIFSC;
        	context.setVariable("beneIFSC", beneIFSC);
        }
        if(myreq.hasOwnProperty('txnType')){
        	txnType = myreq.txnType;
        	context.setVariable("txnType", txnType);
        }
        if(myreq.hasOwnProperty('aggrId')){
        	aggrId = myreq.aggrId;
        	context.setVariable("aggrId", aggrId);
        }
        if(myreq.hasOwnProperty('urn')){
        	urn = myreq.urn;
        	context.setVariable("urn", urn);
        }
        if(myreq.hasOwnProperty('senderAcctNo')){
        	senderAcctNo = myreq.senderAcctNo;
        	context.setVariable("senderAcctNo", senderAcctNo);
        }
        if(myreq.hasOwnProperty('beneAccNo')){
        	beneAccNo = myreq.beneAccNo;
        	context.setVariable("beneAccNo", beneAccNo);
        }
        /* Request */
        /* Response */
        var MESSAGE = "";
        var ERRORCODE = "";
        var RESPONSECODE = "";
        var STATUS = "";
        var RESPONSE = "";
        if(myres.hasOwnProperty('MESSAGE')){
        	MESSAGE = myres.MESSAGE;
        	context.setVariable("neft_MESSAGE", MESSAGE);
        }
        if(myres.hasOwnProperty('ERRORCODE')){
        	ERRORCODE = myres.ERRORCODE;
        	context.setVariable("ERRORCODE", ERRORCODE);
        }
        if(myres.hasOwnProperty('RESPONSECODE')){
        	RESPONSECODE = myres.RESPONSECODE;
        	context.setVariable("RESPONSECODE", RESPONSECODE);
        }
        if(myres.hasOwnProperty('STATUS')){
        	STATUS = myres.STATUS;
        	context.setVariable("STATUS", STATUS);
        }
        if(myres.hasOwnProperty('RESPONSE')){
        	RESPONSE = myres.RESPONSE;
        	context.setVariable("neft_RESPONSE", RESPONSE);
        }
        /* Response */
    }
} catch(err) {
    context.setVariable("CATCH_EXCEPTION", "JS-LogReqResVariables error: " + err);
}