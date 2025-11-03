try{
    var requestContent = context.getVariable("DECODED_DECRYPTED_CONTENT")?context.getVariable("DECODED_DECRYPTED_CONTENT"):context.getVariable("request.content");
    var responseContent = context.getVariable("message.content");
    context.setVariable("back_end_response",responseContent);
    requestContent = JSON.parse(requestContent);
    responseContent = JSON.parse(responseContent);
    var xpriority =  context.getVariable("request.header.x-priority");
    var curr_apikey =  context.getVariable("request.header.apikey");
    var errorcode = 0;
    var receivederr = 0;
    var uniquetransactionid = 0;
    var uniqueDate = "";
    var time = context.getVariable("system.timestamp");
    var date = new Date(time + (3600000 * +5.5));
    var year = date.getFullYear();
    var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    var Tdate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    uniqueDate = year.toString()+month.toString()+Tdate.toString();
    context.setVariable("uniqueDate", uniqueDate);
    context.setVariable("customxpriority", xpriority);
    context.setVariable("txntype","NA");
    if(xpriority == "0120"){
        if(responseContent.hasOwnProperty("ActCode")){
            xpriority = "0100";
        }else{
            xpriority = "0010";
        }
    }
    if(xpriority == "1000"){
        errorcode = responseContent.response;
        var composite_status_request = {};
        var today = "";
        var time = context.getVariable("system.timestamp");
        var date = new Date(time + (3600000 * +5.5));
        var year = date.getFullYear();
        var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        var Tdate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        today = Tdate+'-'+month+'-'+year;
        var seqno = generateAlphanumericSequence();
        uniquetransactionid = requestContent["seq-no"];
        composite_status_request = {
            "date": today,
            "seq-no": seqno,
            "recon360": "N",
            "channel-code": requestContent["channel-code"],
            "ori-seq-no": requestContent["seq-no"],
            "mobile": requestContent.mobile,
            "profile-id": requestContent["profile-id"],
            "device-id": requestContent["device-id"],
            "curr_apikey":curr_apikey
        };
        context.setVariable("txntype","UPI");
        context.setVariable("dec_request",JSON.stringify(composite_status_request));
        receivederr = 1;
        
    }else if(xpriority == "0100"){
        errorcode = responseContent.ActCode;
        var composite_status_request = {};
        var today = "";
        var time = context.getVariable("system.timestamp");
        var date = new Date(time + (3600000 * +5.5));
        var year = date.getFullYear();
        var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        var Tdate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        today = Tdate+'-'+month+'-'+year;
        var seqno = Math.random(100).toString(14).replace('0.', '');
        uniquetransactionid = requestContent.tranRefNo;
        composite_status_request = {
            "Date": today,
            "transRefNo": requestContent.tranRefNo,
            "recon360": "N",
            "passCode": requestContent.passCode,
            "bcID": requestContent.bcID,
            "curr_apikey":curr_apikey
        };
        context.setVariable("txntype","IMPS");
        context.setVariable("dec_request",JSON.stringify(composite_status_request));
        receivederr = 1;
    }else{
        var neftstatus = "";
        var neftresponse = "";
        var sendforrety = false;
        var incremental = "0";
        var utrnumber = "";
        if(responseContent.hasOwnProperty("STATUS") && responseContent.hasOwnProperty("RESPONSE")){
            neftstatus = responseContent.STATUS;
            neftstatus = neftstatus.split(" ").join("").toLowerCase();
            neftresponse = responseContent.RESPONSE;
            neftresponse = neftresponse.split(" ").join("").toLowerCase();
            if(neftresponse=="success" && neftstatus == "pending" && requestContent.txnType == 'RGS'){
                sendforrety = true;  print("line: 80");
                if(responseContent.hasOwnProperty("UTRNUMBER")){
                    utrnumber = responseContent.UTRNUMBER;
                }
                if(!checkIfEmpty(utrnumber)){
                    incremental = "1";
                }
            }else if(neftresponse=="failure" && neftstatus == "pending" && requestContent.txnType == 'RGS'){
                sendforrety = true;  print("line: 87");
                 if(responseContent.hasOwnProperty("UTRNUMBER")){
                    utrnumber = responseContent.UTRNUMBER;
                }
                if(!checkIfEmpty(utrnumber)){
                    incremental = "1";
                }
            }else if(neftresponse=="success" && neftstatus == "success" && requestContent.txnType == 'RGS'){
                sendforrety = true; print("line: 95");
                incremental = "1";
                hitneftinc1hour = 1;
                if(responseContent.hasOwnProperty("UTRNUMBER")){
                    utrnumber = responseContent.UTRNUMBER;
                }
            }else{
                sendforrety = true;
            }
        }
        var composite_status_request = {};
        if(sendforrety === true){
            var aggrid = "";
            var crpid = "";
            var crpusr = "";
            var urn = "";
            var txntype = "";
            if(xpriority == "0010"){
                aggrid = requestContent.aggrId;
                crpid = requestContent.crpId;
                crpusr = requestContent.crpUsr;
                urn = requestContent.urn;
                txntype = requestContent.txnType;
                uniqueid = requestContent.tranRefNo;
            }else if(xpriority == "0001"){
                aggrid = requestContent.AGGRID;
                crpid = requestContent.CORPID;
                crpusr = requestContent.USERID;
                urn = requestContent.URN;
                txntype = requestContent.TXNTYPE;
                uniqueid = requestContent.UNIQUEID;
            }
            uniquetransactionid = uniqueid;
            composite_status_request = {
                "AGGRID": aggrid,
                "CORPID": crpid,
                "USERID": crpusr,
                "URN": urn,
                "UNIQUEID": uniqueid,
                "UTRNUMBER": utrnumber,
                "curr_apikey":curr_apikey
            };
            context.setVariable("txntype",txntype);
            context.setVariable("incremental",incremental);
            context.setVariable("dec_request",JSON.stringify(composite_status_request));
            receivederr = 1;
        }
    }
    context.setVariable("receivederr", receivederr);
    context.setVariable("customxpriority", xpriority);
    context.setVariable("uniquetransactionid", uniquetransactionid);
    
}catch(err){
    context.setVariable("CATCH_EXCEPTION", "Js-MapRequestPushNotification error: " + err);
}

function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}

function generateAlphanumericSequence() {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var sequence = "ICI";
    for (var i = 0; i < 32; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        sequence += characters.charAt(randomIndex);
    }
    return sequence;
}