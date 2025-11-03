var jsonPayload = {};
var PayeeObj = {};
var PayerObj = {};
var MandateDetailsObj = {};
var  emptyStringConst = "",
      invalidTransactionTypeErr = "InvalidTransactionType",
      fieldMappingErr = "Backend Field Mapping Failed",
         invalidDateError = "Date should be 14 digit",
         configErr = "FailedToExtractConfig";
         
var requestBody = JSON.parse(context.getVariable('request.content'));         
var config = JSON.parse(context.getVariable("private.merchantConfig"));
var transactionType = getXmlElementAsString(requestBody.XML.TxnType);
        context.setVariable("private.authenticationType", config.authenticationType);
        context.setVariable("private.encPublicKey", config.publicKey);
        context.setVariable("private.validIpList", config.validIpList);
        context.setVariable("verifyapikey.VA-VerifyApiKey.mode", config.mode);
        context.setVariable("Action", "CallbackEncryption");

try{
    var config = JSON.parse(context.getVariable("private.merchantConfig"));
      context.setVariable("private.authenticationType", config.authenticationType);
}catch(err) {
       context.setVariable("CATCH_EXCEPTION", configErr );
        throw "FailedToExtractConfig";
    }

try {
        //var config = JSON.parse(context.getVariable("private.merchantConfig"));
    //    print(context.getVariable("private.merchantConfig"));
        context.setVariable("private.authenticationType", config.authenticationType);
        context.setVariable("private.encPublicKey", config.publicKey);
        context.setVariable("private.validIpList", config.validIpList);
        context.setVariable("verifyapikey.VA-VerifyApiKey.mode", config.mode);
	context.setVariable("private.apikey", config.apikey);
        
  //      context.setVariable("private.callbackUrl", config[transactionType].targetUrl);
      if(checkIfNullOrEmpty(config[transactionType]))
		{
			context.setVariable("CATCH_EXCEPTION", invalidTransactionTypeErr);
     			throw "InvalidTransactionType";
		}
        else
        context.setVariable("targetUrl", config[transactionType].targetUrl);
      
        if(!checkIfNullOrEmpty(config.sendAdditionalHeaders) && config.sendAdditionalHeaders === "yes") {
            context.setVariable("merchantAuthenticationRequired", "true");
            
            var headerLength = config[transactionType].headers.length;
            var name = [];
            var value = [];
            for (var i = 0; i < headerLength; i++) {
              //  name= name +","+ config[transactionType].headers[i].name;
                name.push(config[transactionType].headers[i].name);
              //  value= value +","+ config[transactionType].headers[i].value;
                value.push(config[transactionType].headers[i].value);
            }  
            context.setVariable("merchantHeaderKeys", name.join());
            context.setVariable("merchantHeaderValues", value.join());
        } 
        else context.setVariable("merchantAuthenticationRequired", "false"); 
        
    } catch(err) {
       context.setVariable("CATCH_EXCEPTION", invalidTransactionTypeErr );
        throw "InvalidTransactionType";
    }
    
try {
    
  var requestBody = JSON.parse(context.getVariable('request.content'));
  if (verifyNotNull(requestBody) && verifyNotNull(requestBody.XML)) {
  var transactionType = getXmlElementAsString(requestBody.XML.TxnType);
  var proccode = getXmlElementAsString(requestBody.XML.ProcCode);

 if(proccode == "UPI014")
 {
     jsonPayload.Payee = PayeeObj;
   
   PayeeObj.Name = getXmlElementAsString(requestBody.XML.Payee.Name);
   PayeeObj.Mobile = getXmlElementAsString(requestBody.XML.Payee.Mobile);
   PayeeObj.VA = getXmlElementAsString(requestBody.XML.Payee.VA);
   PayeeObj.MccCode = getXmlElementAsString(requestBody.XML.Payee.MccCode);
     
     jsonPayload.Payer = PayerObj;
     
   PayerObj.Name = getXmlElementAsString(requestBody.XML.Payer.Name);    
   PayerObj.Mobile = getXmlElementAsString(requestBody.XML.Payer.Mobile);
   PayerObj.VA = getXmlElementAsString(requestBody.XML.Payer.VA); 
   
    jsonPayload.ProfileId = getXmlElementAsString(requestBody.XML.ProfileId);
    jsonPayload.Amount = getXmlElementAsString(requestBody.XML.Amount); 
    jsonPayload.TxnStatus = getXmlElementAsString(requestBody.XML.TxnStatus); 
    jsonPayload.TxnInitDate = getXmlElementAsString(requestBody.XML.TxnInitDate); 
   jsonPayload.TxnCompletionDate = getXmlElementAsString(requestBody.XML.TxnCompletionDate);
   jsonPayload.Note = getXmlElementAsString(requestBody.XML.Note); 
   jsonPayload.OriginalTxnId = getXmlElementAsString(requestBody.XML.OriginalTxnId); 
   jsonPayload.RefId = getXmlElementAsString(requestBody.XML.RefId); 
   jsonPayload.Rrn = getXmlElementAsString(requestBody.XML.Rrn); 
   jsonPayload.ResponseCode = getXmlElementAsString(requestBody.XML.ResponseCode);
   jsonPayload.MessageType = getXmlElementAsString(requestBody.XML.MessageType);
   jsonPayload.ProcCode = getXmlElementAsString(requestBody.XML.ProcCode);
   jsonPayload.NotificationId = getXmlElementAsString(requestBody.XML.NotificationId); 
   
   context.setVariable("request.content", JSON.stringify(jsonPayload)); 
 }
 
 else{
 //walk(requestBody.XML);
  if(proccode == "UPI016"){
        jsonPayload.RiskScores = requestBody.XML.RiskScores;
  }
  
  
  
  
  
  
  jsonPayload.MessageType = getXmlElementAsString(requestBody.XML.MessageType);
  jsonPayload.ProcCode = getXmlElementAsString(requestBody.XML.ProcCode);
  jsonPayload.NotificationId = getXmlElementAsString(requestBody.XML.NotificationId);
  jsonPayload.TargetMobile = getXmlElementAsString(requestBody.XML.TargetMobile);
  jsonPayload.TxnType = getXmlElementAsString(requestBody.XML.TxnType);
  jsonPayload.ProfileId = getXmlElementAsString(requestBody.XML.ProfileId);
  jsonPayload.UpiTranlogId = getXmlElementAsString(requestBody.XML.UpiTranlogId);
  jsonPayload.ExpireAfter = getXmlElementAsString(requestBody.XML.ExpireAfter);
  
   jsonPayload.Payee = PayeeObj;
   
   PayeeObj.Name = getXmlElementAsString(requestBody.XML.Payee.Name);
   PayeeObj.Mobile = getXmlElementAsString(requestBody.XML.Payee.Mobile);
   PayeeObj.VA = getXmlElementAsString(requestBody.XML.Payee.VA);
   PayeeObj.RespCode = getXmlElementAsString(requestBody.XML.Payee.RespCode);
   PayeeObj.MccCode = getXmlElementAsString(requestBody.XML.Payee.MccCode);
   PayeeObj.MccType = getXmlElementAsString(requestBody.XML.Payee.MccType);
   PayeeObj.AccountNo = getXmlElementAsString(requestBody.XML.Payee.AccountNo);
   PayeeObj.Ifsc = getXmlElementAsString(requestBody.XML.Payee.Ifsc);
   PayeeObj.RevRespCode = getXmlElementAsString(requestBody.XML.Payee.RevRespCode);
   PayeeObj.VerifiedMerchant = getXmlElementAsString(requestBody.XML.Payee.VerifiedMerchant);

   
 
    jsonPayload.Payer = PayerObj;
   PayerObj.Name = getXmlElementAsString(requestBody.XML.Payer.Name);    
   PayerObj.Mobile = getXmlElementAsString(requestBody.XML.Payer.Mobile);
   PayerObj.VA = getXmlElementAsString(requestBody.XML.Payer.VA);   
   //PayerObj.AccountType = getXmlElementAsString(requestBody.XML.Payer.AccountType); 
   PayerObj.Ifsc = getXmlElementAsString(requestBody.XML.Payer.Ifsc); 
   PayerObj.RespCode = getXmlElementAsString(requestBody.XML.Payer.RespCode);
   PayerObj.RevRespCode = getXmlElementAsString(requestBody.XML.Payer.RevRespCode); 
   
    
    
   


   
   if((transactionType == "MANDATE-CREATE")  || (transactionType == "MANDATE-CONFIRMATION") || (transactionType == "MANDATE-RESPONSE")){
      jsonPayload.MandateDetails = MandateDetailsObj;
      MandateDetailsObj.AmountRule = getXmlElementAsString(requestBody.XML.MandateDetails.AmountRule);
      MandateDetailsObj.BlockFund = getXmlElementAsString(requestBody.XML.MandateDetails.BlockFund);
      MandateDetailsObj.CreatedDate = getXmlElementAsString(requestBody.XML.MandateDetails.CreatedDate);
      MandateDetailsObj.DebitDay = getXmlElementAsString(requestBody.XML.MandateDetails.DebitDay);
      MandateDetailsObj.DebitRule = getXmlElementAsString(requestBody.XML.MandateDetails.DebitRule);
      MandateDetailsObj.Frequency = getXmlElementAsString(requestBody.XML.MandateDetails.Frequency);
      MandateDetailsObj.MandateAmount = getXmlElementAsString(requestBody.XML.MandateDetails.MandateAmount);
      MandateDetailsObj.MandateName = getXmlElementAsString(requestBody.XML.MandateDetails.MandateName);
      MandateDetailsObj.MandateNote = getXmlElementAsString(requestBody.XML.MandateDetails.MandateNote);
      MandateDetailsObj.MandateOriginalTxnId = getXmlElementAsString(requestBody.XML.MandateDetails.MandateOriginalTxnId);
      MandateDetailsObj.MandateType = getXmlElementAsString(requestBody.XML.MandateDetails.MandateType);
      MandateDetailsObj.PurposeCode = getXmlElementAsString(requestBody.XML.MandateDetails.PurposeCode);
      var checkFrequency = getXmlElementAsString(requestBody.XML.MandateDetails.Frequency);
      if(proccode == "UPI013" && checkFrequency == "ONETIME"){
         MandateDetailsObj.Revokeable = "N";
      }else{
         MandateDetailsObj.Revokeable = getXmlElementAsString(requestBody.XML.MandateDetails.Revokeable); 
      }
      MandateDetailsObj.UMN = getXmlElementAsString(requestBody.XML.MandateDetails.UMN);
      MandateDetailsObj.ValidityEnd = getXmlElementAsString(requestBody.XML.MandateDetails.ValidityEnd);
      MandateDetailsObj.ValidityStart = getXmlElementAsString(requestBody.XML.MandateDetails.ValidityStart);
   }
   
   jsonPayload.Amount = getXmlElementAsString(requestBody.XML.Amount); 
   jsonPayload.ChannelCode = getXmlElementAsString(requestBody.XML.ChannelCode); 
   jsonPayload.TxnStatus = getXmlElementAsString(requestBody.XML.TxnStatus); 
   jsonPayload.TxnInitDate = getXmlElementAsString(requestBody.XML.TxnInitDate); 
   jsonPayload.TxnCompletionDate = getXmlElementAsString(requestBody.XML.TxnCompletionDate);
   jsonPayload.Note = getXmlElementAsString(requestBody.XML.Note); 
   jsonPayload.DeviceId = getXmlElementAsString(requestBody.XML.DeviceId); 
   jsonPayload.OriginalTxnId = getXmlElementAsString(requestBody.XML.OriginalTxnId); 
   jsonPayload.SeqNo = getXmlElementAsString(requestBody.XML.SeqNo); 
   jsonPayload.RefId = getXmlElementAsString(requestBody.XML.RefId);
   jsonPayload.RefUrl = getXmlElementAsString(requestBody.XML.RefUrl); 
   jsonPayload.Rrn = getXmlElementAsString(requestBody.XML.Rrn); 
   jsonPayload.ResponseCode = getXmlElementAsString(requestBody.XML.ResponseCode); 
   jsonPayload.UMN = getXmlElementAsString(requestBody.XML.UMN);
   //jsonPayload.IsFromBlockedVpa = getXmlElementAsString(requestBody.XML.IsFromBlockedVpa); 
   
   
  

   
   
   
   
   
   
   
  context.setVariable("request.content", JSON.stringify(jsonPayload));  
 }

  } else {
    context.setVariable("CATCH_EXCEPTION", fieldMappingErr);
    throw "Backend Field Mapping Failed";
  }
  }catch (error) {
      print(error);
  context.setVariable("CATCH_EXCEPTION", error);
  throw "Backend Field Mapping Failed";
}

function verifyNotNull(field) {
  var result = false;
  if (field && field !== null && field !== undefined) {
    result = true;
  }
  return result;
}

function getXmlElementAsString(xmlElement) {
  try {
    return (JSON.stringify(xmlElement) === "{}") || (JSON.stringify(xmlElement) === "[]") || (JSON.stringify(xmlElement) === undefined) ? emptyStringConst : xmlElement.toString();
  } catch (err) {
    return emptyStringConst;
  }
}

function getUTCDate(datestr) {
  try{  
    if (datestr.length === 14) {
      var dt = new Date(datestr.substring(0, 4), datestr.substring(4, 6) - 1, datestr.substring(6, 8), datestr.substring(8, 10), datestr.substring(10, 12), datestr.substring(12, 14), 0).toISOString();
      return dt;
    } else {
      context.setVariable("CATCH_EXCEPTION", invalidDateError);
      throw "invaliddatevalue";
    }
  }
  catch (err) {
    return emptyStringConst;
  } 
}
function checkIfNullOrEmpty(value) {
    return (value === undefined || value === null || value === "");
}