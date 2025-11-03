var request = {};

//get Request details from Request Payload
if(context.getVariable("enableEncryption") === true || context.getVariable("enableEncryption") === "true"){ 
    request = JSON.parse(context.getVariable("DECODED_DECRYPTED_CONTENT"));
}else{
    request = JSON.parse(context.getVariable("request.content"));
}

//X-priority Header
var priorityHeader = context.getVariable("request.header.x-priority");

//Merchant Details in JSON from Application
var MerchantValidation = JSON.parse(context.getVariable("verifyapikey.VA-VerifyApiKey.merchantDetails"));

//Merchant Details from Application
var merchant_bcid = MerchantValidation.IMPS;
var merchant_aggrid  = MerchantValidation.NEFT;
var merchant_profileid = MerchantValidation.UPI;

var raiseError = false;
var matchMerchant = false;
var ValidationMatch = "";

//Code to Match UPI Parameter with Profile id
if(priorityHeader === "1000" && !checkIfEmpty(merchant_profileid) && !checkIfEmpty(request['profile-id'])){
    if(request['profile-id'] === merchant_profileid)
    {
        matchMerchant = true; 
        context.setVariable("ValidationMatch" ,merchant_profileid +"==="+ request['profile-id']);
    }
    var splitdata = merchant_profileid.split(",");
    for (var i = 0; i < splitdata.length; i++) {
          if(splitdata[i] === request['profile-id'])
          {
              matchMerchant = true;
              context.setVariable("ValidationMatch" ,merchant_profileid +"==="+ splitdata[i] );
          }
	}
    if(matchMerchant === false)
    {
		 raiseError = true;
		 setError("ValidationError", "AuthenticationError");
	
        }    
}

//Code to Match IMPS Parameter with bcID
else if(priorityHeader === "0100" && !checkIfEmpty(merchant_bcid) && !checkIfEmpty(request.bcID)){
    if(request.bcID.toUpperCase() === merchant_bcid.toUpperCase()){
        matchMerchant = true; 
        context.setVariable("ValidationMatch" ,merchant_bcid.toUpperCase() +"==="+ request.bcID.toUpperCase() );
    }
    var splitdata = merchant_bcid.split(",");
    for (var i = 0; i < splitdata.length; i++) {
          if(splitdata[i].toUpperCase() === request.bcID.toUpperCase()){
              matchMerchant = true;
              context.setVariable("ValidationMatch" ,merchant_bcid.toUpperCase() +"==="+ splitdata[i].toUpperCase() );
          }
        }
    if(matchMerchant === false){
			raiseError = true;
			setError("ValidationError", "AuthenticationError");
        }    
}


//Code to Match NEFT Parameter with aggrid
else if(priorityHeader === "0010" && !checkIfEmpty(merchant_aggrid) && !checkIfEmpty(request.aggrId)){
    if(request.aggrId.toUpperCase() === merchant_aggrid.toUpperCase()){
        matchMerchant = true; 
        context.setVariable("ValidationMatch" ,merchant_aggrid.toUpperCase() +"==="+ request.aggrId.toUpperCase() );
    }
    var splitdata = merchant_aggrid.split(",");
    for (var i = 0; i < splitdata.length; i++) {
          if(splitdata[i].toUpperCase() === request.aggrId.toUpperCase()){
              matchMerchant = true;
              context.setVariable("ValidationMatch" ,merchant_aggrid.toUpperCase() +"==="+ splitdata[i].toUpperCase() );
          }
        }
    if(matchMerchant === false){
			raiseError = true;
			setError("ValidationError", "AuthenticationError");
        }    
}


//Code to Match RTGS Parameter with AGGRID
else if(priorityHeader === "0001" && !checkIfEmpty(merchant_aggrid) && !checkIfEmpty(request.AGGRID)){
    if(request.AGGRID.toUpperCase() === merchant_aggrid.toUpperCase()){
        matchMerchant = true; 
        context.setVariable("ValidationMatch" ,merchant_aggrid.toUpperCase() +"==="+ request.AGGRID.toUpperCase() );
    }
    var splitdata = merchant_aggrid.split(",");
    for (var i = 0; i < splitdata.length; i++) {
          if(splitdata[i].toUpperCase() === request.AGGRID.toUpperCase()){
              matchMerchant = true;
              context.setVariable("ValidationMatch" ,merchant_aggrid.toUpperCase() +"==="+ splitdata[i].toUpperCase() );
          }
        }
    if(matchMerchant === false){
			raiseError = true;
			setError("ValidationError", "AuthenticationError");
        }    
}


//Code to Fallback IMPS to NEFT
else if(priorityHeader === "0120" && !checkIfEmpty(merchant_aggrid) && !checkIfEmpty(merchant_bcid) && !checkIfEmpty(request.aggrId) && !checkIfEmpty(request.bcID)){
    if(request.aggrId.toUpperCase() === merchant_aggrid.toUpperCase() && request.bcID.toUpperCase() === merchant_bcid.toUpperCase()){
        matchMerchant = true; 
        context.setVariable("ValidationMatch" ,merchant_aggrid.toUpperCase() +"==="+ request.aggrId.toUpperCase() +"&&"+ merchant_bcid.toUpperCase() +"==="+ request.bcID.toUpperCase());
    }
    var splitdata = merchant_aggrid.split(",");
	var aggridmatchMerchant = false;
    for (var i = 0; i < splitdata.length; i++) {
          if(splitdata[i].toUpperCase() === request.aggrId.toUpperCase()){
              aggridmatchMerchant = true;
          }
        }
		
	var bcidmatchMerchant = false;
	var splitdata = merchant_bcid.split(",");
    for (var i = 0; i < splitdata.length; i++) {
          if(splitdata[i].toUpperCase() === request.bcID.toUpperCase()){
              bcidmatchMerchant = true;
          }
        }
		
	if (bcidmatchMerchant === true && aggridmatchMerchant === true){
		matchMerchant = true;
	}
    else if(matchMerchant === false){
			raiseError = true;
			setError("ValidationError", "AuthenticationError");
        }    
}


//Invalid Payment Mode or empty details
else{
	 raiseError = true;
	 setError("ValidationError", "MissingMandatoryFields");
}

//function to set error
function setError(err, cause) {
    context.setVariable("cause", cause);
    throw err;
}

function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}