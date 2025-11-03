var request = {};
if(context.getVariable("enableEncryption") === true || context.getVariable("enableEncryption") === "true"){ 
    request = JSON.parse(context.getVariable("DECODED_DECRYPTED_CONTENT"));
}
else {
    request = JSON.parse(context.getVariable("request.content"));
}
 
var mandatoryUPIParameters = ["crpID", "aggrID", "userID", "aggrName", "urn","bnfId"];
var mandatoryIMPSParameters = ["crpId", "crpUsr", "aggrId", "aggrName", "urn","bnfId"];
var mandatoryNEFTParameters = ["crpId", "aggrId", "crpUsr", "aggrName", "urn","bnfId"];
var mandatoryRTGSParameters = ["CORPID", "AGGRID", "USERID", "AGGRNAME", "URN","BNFID"];

var priorityHeader = context.getVariable("request.header.x-priority");

validateRequest();

if(priorityHeader === "1000") {
   var req =  "Action.SMS.Init.001=Y&smsBankId=ICI&REQUESTFROM=AGTR&smsCrpId="+request.crpID+"&smsCrpUsr="+request.userID+"&REQUESTTYPE=BENEVAPAGR&smsAggrId="+request.aggrID+"&smsAggrName="+request.aggrName+"&smsAggrURN="+request.urn+"&smsBnfId="+request.bnfId+"&smsBeneType=V";
   context.setVariable("smsBankId","ICI");
   context.setVariable("REQUESTFROM","AGTR");
   context.setVariable("smsCrpId",request.crpID);
   context.setVariable("smsCrpUsr",request.userID);
   context.setVariable("REQUESTTYPE","BENEVAPAGR");
   context.setVariable("smsAggrId",request.aggrID);
   context.setVariable("smsAggrName",request.aggrName);
   context.setVariable("smsAggrURN",request.urn);
   context.setVariable("smsBeneType","V");
    
}
if(priorityHeader === "0100") {
   var req =  "Action.SMS.Init.001=Y&smsBankId=ICI&REQUESTFROM=AGTR&smsCrpId="+request.crpId+"&smsCrpUsr="+request.crpUsr+"&REQUESTTYPE=BENEVAPAGR&smsAggrId="+request.aggrId+"&smsAggrName="+request.aggrName+"&smsAggrURN="+request.urn+"&smsBnfId="+request.bnfId+"&smsBeneType=A";
   context.setVariable("smsBankId","ICI");
   context.setVariable("REQUESTFROM","AGTR");
   context.setVariable("smsCrpId",request.crpId);
   context.setVariable("smsCrpUsr",request.crpUsr);
   context.setVariable("REQUESTTYPE","BENEVAPAGR");
   context.setVariable("smsAggrId",request.aggrId);
   context.setVariable("smsAggrName",request.aggrName);
   context.setVariable("smsAggrURN",request.urn);
   context.setVariable("smsBnfId",request.bnfId);
   context.setVariable("smsBeneType","A");
}
if(priorityHeader === "0010") {
   var req =  "Action.SMS.Init.001=Y&smsBankId=ICI&REQUESTFROM=AGTR&smsCrpId="+request.crpId+"&smsCrpUsr="+request.crpUsr+"&REQUESTTYPE=BENEVAPAGR&smsAggrId="+request.aggrId+"&smsAggrName="+request.aggrName+"&smsAggrURN="+request.urn+"&smsBnfId="+request.bnfId+"&smsBeneType=A";
}
if(priorityHeader === "0001") {
  // var req =  "Action.SMS.Init.001=Y&smsBankId=ICI&REQUESTFROM=AGTR&smsCrpId="+request.CRPID+"&smsCrpUsr="+request.CRPUSR+"&REQUESTTYPE=BENEVAPAGR&smsAggrId="+request.AGGRID+"&smsAggrName="+request.AGGRNAME+"&smsAggrURN="+request.URN+"&smsBnfId="+request.BNFID+"&smsBeneType=A";
  var req =  "Action.SMS.Init.001=Y&smsBankId=ICI&REQUESTFROM=AGTR&smsCrpId="+request.CORPID+"&smsCrpUsr="+request.USERID+"&REQUESTTYPE=BENEVAPAGR&smsAggrId="+request.AGGRID+"&smsAggrName="+request.AGGRNAME+"&smsAggrURN="+request.URN+"&smsBnfId="+request.BNFID+"&smsBeneType=A";
}
if(priorityHeader === "ineft") {
  var req =  "Action.SMS.Init.001=Y&smsBankId=ICI&REQUESTFROM=AGTR&smsCrpId="+request.crpId+"&smsCrpUsr="+request.crpUsr+"&REQUESTTYPE=BENEVAPAGR&smsAggrId="+request.aggrId+"&smsAggrName="+request.aggrName+"&smsAggrURN="+request.urn+"&smsBnfId="+request.bnfId+"&smsBeneType=A";
}
context.setVariable("BeneQuery",req);

print(request);

function validateRequest() {
    
    if(priorityHeader === "1000") {
        mandatoryUPIParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
    if(priorityHeader === "0100") {
        mandatoryIMPSParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
    if(priorityHeader === "0010") {
        mandatoryNEFTParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
    if(priorityHeader === "ineft") {
        mandatoryNEFTParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
    if(priorityHeader === "0001") {
        mandatoryRTGSParameters.forEach(function(parameter) {
            if(!request.hasOwnProperty(parameter) || checkIfEmpty(request[parameter]))
                setError("ValidationError", "MissingMandatoryFields");
        });
    }
}

function setError(err, cause) {
    context.setVariable("cause", cause);
    throw err;
}
function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}