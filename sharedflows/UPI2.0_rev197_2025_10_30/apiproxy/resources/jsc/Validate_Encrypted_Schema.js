 var requestContent = context.getVariable("DECODED_DECRYPTED_CONTENT") ? context.getVariable("DECODED_DECRYPTED_CONTENT") : context.getVariable("request.content");
context.setVariable("request.content", requestContent);  
var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
var request_verb = context.getVariable("request.verb");
try{
var schema = "";
//   if (proxyPathSuffix === "/GetComplaintReasonCode" || proxyPathSuffix === "/GetComplaintList"  || proxyPathSuffix === "/RaiseTransactionComplaint"  || proxyPathSuffix === "/CheckTransactionDisputeStatus"  || proxyPathSuffix === "/RequestDispute" || proxyPathSuffix === "/ValidateQR" || proxyPathSuffix === "/ManageInternationalTransaction" || proxyPathSuffix === "/PayerPANValidation" || proxyPathSuffix === "/PayerAccount" || proxyPathSuffix === "/GetTxnStatusBackOffice" || proxyPathSuffix === "/CommonPayRequest"  || proxyPathSuffix === "/GetToken" || proxyPathSuffix === "/GetProfileDetails"  && request_verb == "POST" ) {
     if (proxyPathSuffix === "/ListKeys" || proxyPathSuffix === "/ListPSP"  || proxyPathSuffix === "/ListAccountProvider" || proxyPathSuffix === "/GetToken" || proxyPathSuffix === "/GetProfileDetails" || proxyPathSuffix === "/GetProfileID"  || proxyPathSuffix === "/UpdateMobile" || proxyPathSuffix === "/UpdateDevice" || proxyPathSuffix === "/DeregisterProfile" || proxyPathSuffix === "/VirtualAddressAvailability" || proxyPathSuffix === "/GenerateOTP" || proxyPathSuffix === "/ListAccounts" || proxyPathSuffix === "/RegisterMobileNumber" || proxyPathSuffix === "/StoreAccountDetails" || proxyPathSuffix === "/ListVirtualAddresses" || proxyPathSuffix === "/ListVerifiedAddressesEntries" || proxyPathSuffix === "/ListCustomerAccounts" || proxyPathSuffix === "/ChangePrimaryAccount" || proxyPathSuffix === "/ValidateAddress" || proxyPathSuffix === "/PayRequestGlobal" || proxyPathSuffix === "/CommonPayRequest" || proxyPathSuffix === "/CollectRequest" || proxyPathSuffix === "/GetPendingRequest" || proxyPathSuffix === "/TransactionStatus"  || proxyPathSuffix === "/BalanceEnquiry" || proxyPathSuffix === "/MiniStatement" || proxyPathSuffix === "/ChangeMPIN" || proxyPathSuffix === "/MerchantStoreAccountDetails" || proxyPathSuffix === "/PayRequest" || proxyPathSuffix === "/PayMerchantRequest" || proxyPathSuffix === "/CollectAuth" || proxyPathSuffix === "/MerchantCollectRequest" || proxyPathSuffix === "/MerchantRefundRequest" || proxyPathSuffix === "/ManageVerifiedAddresses" || proxyPathSuffix === "/DeviceBinding" || proxyPathSuffix === "/ReclaimVPA" || proxyPathSuffix === "/ManageMandate" || proxyPathSuffix === "/GetPendingMandates" || proxyPathSuffix === "/GetActiveMandates" || proxyPathSuffix === "/Approve/Rejectpendingmandates" || proxyPathSuffix === "/GetAllMandates" || proxyPathSuffix === "/MandateHistory" || proxyPathSuffix === "/InitiatemandateCollect" || proxyPathSuffix === "/BlockedVpaList" || proxyPathSuffix === "/BlockUnblockCustomer" || proxyPathSuffix === "/BlockUnblockVPA" || proxyPathSuffix === "/GetTransactionDetails" || proxyPathSuffix === "/GetTransactionHistory" || proxyPathSuffix === "/GetVPADetails" || proxyPathSuffix === "/GetComplaintReasonCode" || proxyPathSuffix === "/RaiseTransactionComplaint" || proxyPathSuffix === "/GetComplaintList" || proxyPathSuffix === "/CheckTransactionDisputeStatus" || proxyPathSuffix === "/RequestDispute" || proxyPathSuffix === "/PullSMSRequest" || proxyPathSuffix === "/GetAutoCreatedVPA" || proxyPathSuffix === "/GetMandateHistory" || proxyPathSuffix === "/TransactionsPull" || proxyPathSuffix === "/PayToContact" || proxyPathSuffix === "/GetUpiNumberStatus" || proxyPathSuffix === "/ManageUpiNumber" || proxyPathSuffix === "/ListUpiNumber" || proxyPathSuffix === "/DeregisterProfileIdempotency" || proxyPathSuffix === "/ReclaimVPAIdempotency" || proxyPathSuffix === "/RaiseDisputeRefund" || proxyPathSuffix === "/ValidateQR" || proxyPathSuffix === "/ManageInternationalTransaction" || proxyPathSuffix === "/PayerPANValidation" || proxyPathSuffix === "/PayerAccount" || proxyPathSuffix === "/GetTxnStatusBackOffice"  || proxyPathSuffix === "/LogRefId" || proxyPathSuffix === "/GetUpiLiteDetails"  || proxyPathSuffix === "/CheckStatus" || proxyPathSuffix === "/blockunblockstatus"  || proxyPathSuffix === "/InitiateMandatePay"  || proxyPathSuffix === "/ManageDelegateUser" || proxyPathSuffix === "/ValidateDelegateAUTH" || proxyPathSuffix === "/DelegateAuth"  || proxyPathSuffix === "/AddSecondaryVpa"  || proxyPathSuffix === "/ApproveDelegateAUTH"|| proxyPathSuffix === "/GetLinkDelegateDetails"  || proxyPathSuffix === "/GetPendingDelegatePayments" || proxyPathSuffix === "/BlockUnblockChannels"  || proxyPathSuffix === "/ReqCCBill" || proxyPathSuffix === "/ManageEMI"  || proxyPathSuffix === "/RequestValidateCustomer" || proxyPathSuffix === "/BalanceInquiryCDM"  || proxyPathSuffix === "/GetServerSSCLToken" || proxyPathSuffix === "/SetUserSsclCred"  || proxyPathSuffix === "/FetchActivationStatus"  || proxyPathSuffix === "/ManageActivation" &&  request_verb == "POST" ) {
        schema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "requestId": {
      "type": "string",
    //   "pattern":"^[0-9a-zA-Z]{0,100}$"
    "pattern":"^(?!.*?--)[0-9a-zA-Z-_]{0,64}$|^$"
    },
    "service": {
      "type": "string",
      "pattern":"^(?!.*--)[0-9a-zA-Z-_]{0,64}$|^$"
    },
    "encryptedKey": {
      "type": "string"
    },
    "oaepHashingAlgorithm": {
      "type": "string",
     "pattern":"^(?!.*--)[0-9a-zA-Z-_]{0,64}$|^$"
    },
    "iv": {
      "type": "string"
    //   "pattern":"^(?!.*--)[0-9a-zA-Z-_/=]{0,64}$|^$"
    },
    "encryptedData": {
      "type": "string"
    },
    "clientInfo": {
      "type": "string",
      "pattern":"^(?!.*--)[0-9a-zA-Z-_]{0,64}$|^$"
    },
    "optionalParam": {
      "type": "string",
      "pattern":"^(?!.*--)[0-9a-zA-Z-_]{0,64}$|^$"
    }
  },
  "required": [
    // "requestId",
    "service",
    "encryptedKey",
    "oaepHashingAlgorithm",
    "iv",
    "encryptedData",
    // "clientInfo",
    // "optionalParam"
  ]
};

 var data = JSON.parse(requestContent);
    var opt = tv4.validate(data, schema);
    context.setVariable("valid", opt);
    if (opt === false) {
    context.setVariable("ErrorType", "Invalid Data Type");
        context.setVariable("SchemaError", tv4.error.message);
        validJson();
    }
}
    
} catch (err) {
    context.setVariable("CATCH_EXCEPTION_200", err);
    context.setVariable("linenumber",err.lineNumber);
    throw err;
}

function validJson() {
    var finalResponse = {
        "success": false,
        "errorcode": "400",
        "errormessage": "Mandatory Field is Missing"

    };
   //  throw JSON.stringify(finalResponse);
     
}