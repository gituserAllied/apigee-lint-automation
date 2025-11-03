// var pathsuffix = context.getVariable("proxy.pathsuffix");
// var basepath = context.getVariable("proxy.basepath");
// var flowType = "UNKNOWN";

// if(basepath === "/api/v1/upi2")
//     if(pathsuffix.indexOf('/GetAllMandates/') !== -1)
//      flowType = "GetAllMandates";


// if(basepath === "/api/v1/callback/generic")
//     flowType = "CALLBACK_RESPONSE";
    

// context.setVariable("flowType", flowType);
// print(flowType)

try {
    var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
    var basepath = context.getVariable("proxy.basepath");
    var flowType = "UNKNOWN";

    if (proxyPathSuffix === "/GetAllMandates") {
        flowType = "GetAllMandates";
    } else if (proxyPathSuffix === "/ListKeys") {
        flowType = "ListKeys";
    } else if (proxyPathSuffix === "/ListPSP") {
        flowType = "ListPSP";
    } else if (proxyPathSuffix === "/ListAccountProvider") {
        flowType = "ListAccountProvider";
    } else if (proxyPathSuffix === "/GetToken") {
        flowType = "GetToken"; 
    } else if (proxyPathSuffix === "/GetProfileDetails") {
        flowType = "GetProfileDetails"; 
    }else if (proxyPathSuffix === "/GetProfileID") {
        flowType = "GetProfileID"; 
    }else if (proxyPathSuffix === "/UpdateMobile") {
        flowType = "UpdateMobile"; 
    }else if (proxyPathSuffix === "/UpdateDevice") {
        flowType = "UpdateDevice"; 
    }else if (proxyPathSuffix === "/DeregisterProfile") {
        flowType = "DeregisterProfile"; 
    }else if (proxyPathSuffix === "/VirtualAddressAvailability") {
        flowType = "VirtualAddressAvailability"; 
    }else if (proxyPathSuffix === "/GenerateOTP") {
        flowType = "Generate OTP"; 
    }else if (proxyPathSuffix === "/ListAccounts") {
        flowType = "ListAccounts"; 
    }else if (proxyPathSuffix === "/RegisterMobileNumber") {
        flowType = "RegisterMobileNumber"; 
    }else if (proxyPathSuffix === "/StoreAccountDetails") {
        flowType = "StoreAccountDetails"; 
    }else if (proxyPathSuffix === "/ListVirtualAddresses") {
        flowType = "ListVirtualAddresses"; 
    }else if (proxyPathSuffix === "/ListVerifiedAddressesEntries") {
        flowType = "ListVerifiedAddressesEntries"; 
    }else if (proxyPathSuffix === "/ListCustomerAccounts") {
        flowType = "ListCustomerAccounts"; 
    }else if (proxyPathSuffix === "/ChangePrimaryAccount") {
        flowType = "ChangePrimaryAccount"; 
    }else if (proxyPathSuffix === "/ValidateAddress") {
        flowType = "ValidateAddress"; 
    }else if (proxyPathSuffix === "/PayRequestGlobal") {
        flowType = "PayRequestGlobal"; 
    }else if (proxyPathSuffix === "/CommonPayRequest") {
        flowType = "CommonPayRequest"; 
    }else if (proxyPathSuffix === "/GetPendingRequest") {
        flowType = "GetPendingRequest"; 
    }else if (proxyPathSuffix === "/TransactionStatus") {
        flowType = "TransactionStatus"; 
    }else if (proxyPathSuffix === "/BalanceEnquiry") {
        flowType = "BalanceEnquiry"; 
    }
     else if (proxyPathSuffix === "/ChangeMPIN") {
        flowType = "ChangeMPIN"; 
    }else if (proxyPathSuffix === "/MerchantStoreAccountDetails") {
        flowType = "MerchantStoreAccountDetails"; 
    }else if (proxyPathSuffix === "/PayRequest") {
        flowType = "PayRequest"; 
    }else if (proxyPathSuffix === "/PayMerchantRequest") {
        flowType = "PayMerchantRequest"; 
    }else if (proxyPathSuffix === "/CollectAuth") {
        flowType = "CollectAuth"; 
    }else if (proxyPathSuffix === "/MerchantCollectRequest") {
        flowType = "MerchantCollectRequest"; 
    }else if (proxyPathSuffix === "/ManageVerifiedAddresses") {
        flowType = "ManageVerifiedAddresses"; 
    }else if (proxyPathSuffix === "/DeviceBinding") {
        flowType = "DeviceBinding"; 
    }else if (proxyPathSuffix === "/ReclaimVPA") {
        flowType = "ReclaimVPA"; 
    }else if (proxyPathSuffix === "/ManageMandate") {
        flowType = "ManageMandate"; 
    }else if (proxyPathSuffix === "/GetPendingMandates") {
        flowType = "GetPendingMandates";
    }
    else if (proxyPathSuffix === "/GetActiveMandates") {
        flowType = "GetActiveMandates"; 
    }else if (proxyPathSuffix === "/Approve/Rejectpendingmandates") {
        flowType = "Approve/Rejectpendingmandates"; 
    }else if (proxyPathSuffix === "/GetAllMandates") {
        flowType = "GetAllMandates"; 
    }else if (proxyPathSuffix === "/MandateHistory") {
        flowType = "MandateHistory"; 
    }else if (proxyPathSuffix === "/InitiatemandateCollect") {
        flowType = "InitiatemandateCollect"; 
    }else if (proxyPathSuffix === "/BlockedVpaList") {
        flowType = "BlockedVpaList"; 
    }else if (proxyPathSuffix === "/BlockUnblockCustomer") {
        flowType = "BlockUnblockCustomer"; 
    }else if (proxyPathSuffix === "/BlockUnblockVPA") {
        flowType = "BlockUnblockVPA"; 
    }else if (proxyPathSuffix === "/GetTransactionDetails") {
        flowType = "GetTransactionDetails"; 
    }else if (proxyPathSuffix === "/GetTransactionHistory") {
        flowType = "GetTransactionHistory"; 
    }else if (proxyPathSuffix === "/GetVPADetails") {
        flowType = "GetVPADetails";
    }
    else if (proxyPathSuffix === "/GetComplaintReasonCode") {
        flowType = "GetComplaintReasonCode"; 
    }else if (proxyPathSuffix === "/RaiseTransactionComplaint") {
        flowType = "RaiseTransactionComplaint"; 
    }else if (proxyPathSuffix === "/GetComplaintList") {
        flowType = "GetComplaintList"; 
    }else if (proxyPathSuffix === "/CheckTransactionDisputeStatus") {
        flowType = "CheckTransactionDisputeStatus"; 
    }else if (proxyPathSuffix === "/RequestDispute") {
        flowType = "RequestDispute"; 
    }else if (proxyPathSuffix === "/PullSMSRequest") {
        flowType = "PullSMSRequest"; 
    }else if (proxyPathSuffix === "/GetAutoCreatedVPA") {
        flowType = "GetAutoCreatedVPA"; 
    }else if (proxyPathSuffix === "/GetMandateHistory") {
        flowType = "GetMandateHistory"; 
    }else if (proxyPathSuffix === "/TransactionsPull") {
        flowType = "TransactionsPull"; 
    }else if (proxyPathSuffix === "/PayToContact") {
        flowType = "PayToContact"; 
    }else if (proxyPathSuffix === "/GetUpiNumberStatus") {
        flowType = "GetUpiNumberStatus";
    }
    else if (proxyPathSuffix === "/ManageUpiNumber") {
        flowType = "ManageUpiNumber"; 
    }else if (proxyPathSuffix === "/ListUpiNumber") {
        flowType = "ListUpiNumber"; 
    }else if (proxyPathSuffix === "/DeregisterProfileIdempotency") {
        flowType = "DeregisterProfileIdempotency"; 
    }else if (proxyPathSuffix === "/ReclaimVPAIdempotency") {
        flowType = "ReclaimVPAIdempotency"; 
    }else if (proxyPathSuffix === "/RaiseDisputeRefund") {
        flowType = "RaiseDisputeRefund"; 
    }else if (proxyPathSuffix === "/ValidateQR") {
        flowType = "ValidateQR"; 
    }else if (proxyPathSuffix === "/ManageInternationalTransaction") {
        flowType = "ManageInternationalTransaction"; 
    }else if (proxyPathSuffix === "/PayerPANValidation") {
        flowType = "PayerPANValidation"; 
    }else if (proxyPathSuffix === "/PayerAccount") {
        flowType = "PayerAccount"; 
    }else if (proxyPathSuffix === "/GetTxnStatusBackOffice") {
        flowType = "GetTxnStatusBackOffice"; 
   }
    else  if(basepath === "/api/v1/callback/generic")
         flowType = "CALLBACK_RESPONSE";
    context.setVariable("flowType", flowType);
}
catch(err) {
    context.setVariable("CATCH_EXCEPTION", err);
}