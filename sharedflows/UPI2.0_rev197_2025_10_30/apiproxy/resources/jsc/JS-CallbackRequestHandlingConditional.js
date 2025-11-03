var jsonPayload = {};
var PayeeObj = {};
var PayerObj = {};
var MandateDetailsObj = {},
      MandateMetadataObj = {},
      GstObj={},
      InvoiceObj={},
      MerchantObj={},
      IdentifierObj={},
      NameObj={},
      OwnershipObj={},
      AmountObj={};

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
    // PayerObj.AccountType = getXmlElementAsString(requestBody.XML.Payer.AccountType);
   
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
  
  
switch (transactionType){
    
       case "COMPLAINT.TXN":
        
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
      PayerObj.AccountNo = getXmlElementAsString(requestBody.XML.Payer.AccountNo); 

   PayerObj.AccountType = getXmlElementAsString(requestBody.XML.Payer.AccountType); 
   PayerObj.Ifsc = getXmlElementAsString(requestBody.XML.Payer.Ifsc); 
   PayerObj.RespCode = getXmlElementAsString(requestBody.XML.Payer.RespCode);
   PayerObj.RevRespCode = getXmlElementAsString(requestBody.XML.Payer.RevRespCode); 
             PayerObj.GstIncentiveApplicable = getXmlElementAsString(requestBody.XML.Payer.GstIncentiveApplicable); 

   
   
      
      

     jsonPayload.Amount = getXmlElementAsString(requestBody.XML.Amount); 
   jsonPayload.ChannelCode = getXmlElementAsString(requestBody.XML.ChannelCode); 
   jsonPayload.TxnStatus = getXmlElementAsString(requestBody.XML.TxnStatus); 
   jsonPayload.TxnInitDate = getXmlElementAsString(requestBody.XML.TxnInitDate); 
   jsonPayload.TxnCompletionDate = getXmlElementAsString(requestBody.XML.TxnCompletionDate);
   jsonPayload.Note = getXmlElementAsString(requestBody.XML.Note); 
   jsonPayload.DeviceId = getXmlElementAsString(requestBody.XML.DeviceId); 
   jsonPayload.OriginalTxnId = getXmlElementAsString(requestBody.XML.OriginalTxnId); 
//   jsonPayload.SeqNo = getXmlElementAsString(requestBody.XML.SeqNo); 
   jsonPayload.RefId = getXmlElementAsString(requestBody.XML.RefId);
   jsonPayload.RefUrl = getXmlElementAsString(requestBody.XML.RefUrl); 
   jsonPayload.Rrn = getXmlElementAsString(requestBody.XML.Rrn); 
         jsonPayload.NeedPayerGstConsent = getXmlElementAsString(requestBody.XML.NeedPayerGstConsent);
                       jsonPayload.IsFromBlockedVpa = getXmlElementAsString(requestBody.XML.IsFromBlockedVpa);
                               jsonPayload.complaintRefNo = getXmlElementAsString(requestBody.XML.complaintRefNo);
jsonPayload.AdjAmount = getXmlElementAsString(requestBody.XML.AdjAmount);

        jsonPayload.AdjTs = getXmlElementAsString(requestBody.XML.AdjTs);
      jsonPayload.AdjRefId = getXmlElementAsString(requestBody.XML.AdjRefId);
      jsonPayload.AdjFlag = getXmlElementAsString(requestBody.XML.AdjFlag);
      jsonPayload.AdjCode = getXmlElementAsString(requestBody.XML.AdjCode);
            jsonPayload.ReqAdjAmount = getXmlElementAsString(requestBody.XML.ReqAdjAmount);

      
      jsonPayload.AdjRemarks = getXmlElementAsString(requestBody.XML.AdjRemarks);
      jsonPayload.RejectReason = getXmlElementAsString(requestBody.XML.RejectReason);
      jsonPayload.ReqAdjFlag = getXmlElementAsString(requestBody.XML.ReqAdjFlag);
      jsonPayload.ReqAdjCode = getXmlElementAsString(requestBody.XML.ReqAdjCode);
            jsonPayload.CurrCycle = getXmlElementAsString(requestBody.XML.CurrCycle);
      jsonPayload.OrgSettRespCode = getXmlElementAsString(requestBody.XML.OrgSettRespCode);





   jsonPayload.ResponseCode = getXmlElementAsString(requestBody.XML.ResponseCode); 
   jsonPayload.UMN = getXmlElementAsString(requestBody.XML.UMN);
   //jsonPayload.IsFromBlockedVpa = getXmlElementAsString(requestBody.XML.IsFromBlockedVpa);

       PayeeObj.VerifiedMerchant = getXmlElementAsString(requestBody.XML.Payee.VerifiedMerchant);
       
           jsonPayload.MandateMetadat = MandateMetadataObj;
MandateMetadataObj.Umn = getXmlElementAsString(requestBody.XML.MandateMetadat.Umn);
MandateMetadataObj.SequenceNumber = getXmlElementAsString(requestBody.XML.MandateMetadat.SequenceNumber);
      jsonPayload.payeePspReqTxnConfirmationTime = getXmlElementAsString(requestBody.XML.payeePspReqTxnConfirmationTime);
      jsonPayload.payeePspTxnConfirmationCallbackInitiationTime = getXmlElementAsString(requestBody.XML.payeePspTxnConfirmationCallbackInitiationTime);
            jsonPayload.Gstin = getXmlElementAsString(requestBody.XML.Gstin);
            
                       jsonPayload.Gst = GstObj;
                       GstObj.Amount =  getXmlElementAsString(requestBody.XML.Gst.Amount);
                       GstObj.Cgst = getXmlElementAsString(requestBody.XML.Gst.Cgst);
                                             GstObj.Sgst = getXmlElementAsString(requestBody.XML.Gst.Sgst);
                       GstObj.Igst = getXmlElementAsString(requestBody.XML.Gst.Igst);
                       GstObj.Cess = getXmlElementAsString(requestBody.XML.Gst.Cess);
                       
                                              jsonPayload.Invoice = InvoiceObj;
                                              
InvoiceObj.InvoiceNumber = getXmlElementAsString(requestBody.XML.Invoice.InvoiceNumber);
InvoiceObj.InvoiceDate = getXmlElementAsString(requestBody.XML.Invoice.InvoiceDate);
InvoiceObj.InvoiceUrl = getXmlElementAsString(requestBody.XML.Invoice.InvoiceUrl);
 
        break;
        
        case "MANDATENOTIFICATION":
            
  jsonPayload.MessageType = getXmlElementAsString(requestBody.XML.MessageType);
  jsonPayload.ProcCode = getXmlElementAsString(requestBody.XML.ProcCode);
  jsonPayload.NotificationId = getXmlElementAsString(requestBody.XML.NotificationId);
  jsonPayload.TargetMobile = getXmlElementAsString(requestBody.XML.TargetMobile);
  jsonPayload.TxnType = getXmlElementAsString(requestBody.XML.TxnType);
  jsonPayload.ProfileId = getXmlElementAsString(requestBody.XML.ProfileId);
  jsonPayload.UpiTranlogId = getXmlElementAsString(requestBody.XML.UpiTranlogId);
    jsonPayload.Amount = getXmlElementAsString(requestBody.XML.Amount);

  jsonPayload.ChannelCode = getXmlElementAsString(requestBody.XML.ChannelCode);
  jsonPayload.NotificationDate = getXmlElementAsString(requestBody.XML.NotificationDate);
  jsonPayload.ExecutionDateTime = getXmlElementAsString(requestBody.XML.ExecutionDateTime);
  jsonPayload.Note = getXmlElementAsString(requestBody.XML.Note);
  jsonPayload.UMN = getXmlElementAsString(requestBody.XML.UMN);
  jsonPayload.MandateName = getXmlElementAsString(requestBody.XML.MandateName);
  jsonPayload.MandateNickName = getXmlElementAsString(requestBody.XML.MandateNickName);
  jsonPayload.Purpose = getXmlElementAsString(requestBody.XML.Purpose);
  jsonPayload.TxnId = getXmlElementAsString(requestBody.XML.TxnId);
  jsonPayload.OriginalTxnId = getXmlElementAsString(requestBody.XML.OriginalTxnId);
  jsonPayload.OrgRrn = getXmlElementAsString(requestBody.XML.OrgRrn);
  jsonPayload.RefId = getXmlElementAsString(requestBody.XML.RefId);
  jsonPayload.Rrn = getXmlElementAsString(requestBody.XML.Rrn);
  jsonPayload.ValidityStartDate = getXmlElementAsString(requestBody.XML.ValidityStartDate);
  jsonPayload.ValidityEndDate = getXmlElementAsString(requestBody.XML.ValidityEndDate);
  jsonPayload.Frequency = getXmlElementAsString(requestBody.XML.Frequency);
  jsonPayload.DebitDay = getXmlElementAsString(requestBody.XML.DebitDay);
  jsonPayload.DebitRule = getXmlElementAsString(requestBody.XML.DebitRule);
  jsonPayload.Revokable = getXmlElementAsString(requestBody.XML.Revokable);
  
  jsonPayload.Payee = PayeeObj;
   
  PayeeObj.Name = getXmlElementAsString(requestBody.XML.Payee.Name);
  PayeeObj.Mobile = getXmlElementAsString(requestBody.XML.Payee.Mobile);
  PayeeObj.VA = getXmlElementAsString(requestBody.XML.Payee.VA);
  PayeeObj.Code = getXmlElementAsString(requestBody.XML.Payee.Code);
  PayeeObj.Type = getXmlElementAsString(requestBody.XML.Payee.Type);
  PayeeObj.AccountNo = getXmlElementAsString(requestBody.XML.Payee.AccountNo);
  PayeeObj.Ifsc = getXmlElementAsString(requestBody.XML.Payee.Ifsc);
  
  PayeeObj.Merchant=MerchantObj;
   
  PayeeObj.Merchant.Identifier = IdentifierObj;
   
     PayeeObj.Merchant.Identifier.subCode= getXmlElementAsString(requestBody.XML.Payee.Merchant.Identifier.subCode);
     PayeeObj.Merchant.Identifier.mid= getXmlElementAsString(requestBody.XML.Payee.Merchant.Identifier.mid);
    PayeeObj.Merchant.Identifier.sid= getXmlElementAsString(requestBody.XML.Payee.Merchant.Identifier.sid);
     PayeeObj.Merchant.Identifier.tid= getXmlElementAsString(requestBody.XML.Payee.Merchant.Identifier.tid);
     PayeeObj.Merchant.Identifier.merchantType= getXmlElementAsString(requestBody.XML.Payee.Merchant.Identifier.merchantType);
    PayeeObj.Merchant.Identifier.merchantType= getXmlElementAsString(requestBody.XML.Payee.Merchant.Identifier.merchantType);
     PayeeObj.Merchant.Identifier.merchantGenre= getXmlElementAsString(requestBody.XML.Payee.Merchant.Identifier.merchantGenre);
     PayeeObj.Merchant.Identifier.onBoardingType= getXmlElementAsString(requestBody.XML.Payee.Merchant.Identifier.onBoardingType);
     
     
        PayeeObj.Merchant.Name = NameObj;
        
      PayeeObj.Merchant.Name.brand= getXmlElementAsString(requestBody.XML.Payee.Merchant.Name.brand);
      PayeeObj.Merchant.Name.legal= getXmlElementAsString(requestBody.XML.Payee.Merchant.Name.legal);
      PayeeObj.Merchant.Name.franchise= getXmlElementAsString(requestBody.XML.Payee.Merchant.Name.franchise);


        
        
        PayeeObj.Merchant.Ownership = OwnershipObj;
        
                PayeeObj.Merchant.Ownership.type= getXmlElementAsString(requestBody.XML.Payee.Merchant.Ownership.type);
      PayeeObj.Merchant.Name.brand= getXmlElementAsString(requestBody.XML.Payee.Merchant.Name.brand);

        PayeeObj.Amount = AmountObj;
        
        PayeeObj.Amount.value= getXmlElementAsString(requestBody.XML.Payee.Amount.value);
        PayeeObj.Amount.curr= getXmlElementAsString(requestBody.XML.Payee.Amount.curr);

    jsonPayload.Payer = PayerObj;
  PayerObj.Name = getXmlElementAsString(requestBody.XML.Payer.Name);    
  PayerObj.Mobile = getXmlElementAsString(requestBody.XML.Payer.Mobile);
  PayerObj.VA = getXmlElementAsString(requestBody.XML.Payer.VA);   
      PayerObj.AccountNo = getXmlElementAsString(requestBody.XML.Payer.AccountNo); 

  PayerObj.AccountType = getXmlElementAsString(requestBody.XML.Payer.AccountType); 
  PayerObj.Ifsc = getXmlElementAsString(requestBody.XML.Payer.Ifsc); 
  PayerObj.MandateNotificationSeqNum = getXmlElementAsString(requestBody.XML.Payer.MandateNotificationSeqNum);

   

        


     
     



  
            
            break;
        
        
        
      
      default:
        context.setVariable("CATCH_EXCEPTION", invalidTransactionTypeErr);
        throw "Backend Field Mapping Failed";
    
    
} 


   
   
   
   
   
   
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