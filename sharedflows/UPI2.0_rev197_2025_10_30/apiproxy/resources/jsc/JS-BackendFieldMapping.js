var jsonPayload = {},
    upiTransactionStatusMetadataObj = {},
    upiTransactionInfoObj = {},
    upiCardInfoObj = {},
      amountObj = {},
      payerStatusObj = {},
      payeeStatusObj = {},
      mandateObj = {},
      merchant_metadataObj = {},
      execution_restrictionObj = {},
      mandateMetadataObj = {},
      adjustmentAmountObj = {},
      originalAdjustmentAmountObj = {},
       /* GST changes */
      gstMainObj = {},
      gstBreakUpObj = {},
      gstObj = {},
      cgstObj = {},
      sgstObj = {},
      igstObj = {},
      cessObj = {},
      invoiceObj = {},
        upiNumberDetailsObj = {};

       /* GST changes */
      upiTransactionDebugInfoObj = {};
      upiDisputeStatusInfoObj = {};
      
      /* Mapper */
      

    var currencyCodeConst = "INR",
      emptyStringConst = "",
      invalidTransactionTypeErr = "Invalid TransactionType",
      fieldMappingErr = "Backend Field Mapping Failed",
      invalidDateError = "Date should be 14 digit";

try {
  var requestBody = JSON.parse(context.getVariable('request.content'));

  if (verifyNotNull(requestBody) && verifyNotNull(requestBody.XML)) {

    var transactionType = getXmlElementAsString(requestBody.XML.TxnType);

    switch (transactionType) {
      case "PAY":
      case "COMPLAINT.TXN":
        upiTransactionStatusMetadataObj.transactionRequestType = "PAY_TO_VPA";
        upiTransactionInfoObj.transactionId = getXmlElementAsString(requestBody.XML.OriginalTxnId);
        upiTransactionInfoObj.payerVpa = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.VA) : emptyStringConst;
        upiTransactionInfoObj.payeeVpa = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.VA) : emptyStringConst;
        if (getXmlElementAsString(requestBody.XML.Amount) !== emptyStringConst) {
          amountObj.currencyCode = currencyCodeConst;
          amountObj.units = getInteger(getXmlElementAsString(requestBody.XML.Amount).split(".")[0]);
          amountObj.nanos = getXmlElementAsString(requestBody.XML.Amount).split(".")[1] === undefined ? 0 : getInteger(("0." + requestBody.XML.Amount.toString().split(".")[1]) * 1000000000);
        } else {
          amountObj.currencyCode = currencyCodeConst;
          amountObj.units = 0;
          amountObj.nanos = 0;
        }

        upiTransactionInfoObj.amount = amountObj;
        upiTransactionInfoObj.expireTime = getXmlElementAsString(requestBody.XML.TxnCompletionDate) !== emptyStringConst ? getUTCDate(getXmlElementAsString(requestBody.XML.TxnCompletionDate)) : emptyStringConst;
        upiTransactionInfoObj.payerName = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.Name) : emptyStringConst;
        upiTransactionInfoObj.payeeName = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.Name) : emptyStringConst;
        upiTransactionInfoObj.payeeRemarks = emptyStringConst;
        upiTransactionInfoObj.payerRemarks = getXmlElementAsString(requestBody.XML.Note);
        upiTransactionInfoObj.upiRefId = getXmlElementAsString(requestBody.XML.Rrn);
        upiTransactionInfoObj.vendorReferenceId = getXmlElementAsString(requestBody.XML.UpiTranlogId);
        upiTransactionInfoObj.payeeMaskedAccountNo = emptyStringConst;
        upiTransactionInfoObj.payerMaskedAccountNo = emptyStringConst;
        upiTransactionInfoObj.payeeBankIfsc = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.Ifsc) : emptyStringConst;
        upiTransactionInfoObj.payerBankIfsc = emptyStringConst;

        upiTransactionStatusMetadataObj.upiTransactionInfo = upiTransactionInfoObj;
        jsonPayload.upiTransactionStatusMetadata = upiTransactionStatusMetadataObj;
        jsonPayload.statusCode = getXmlElementAsString(requestBody.XML.ResponseCode);
        jsonPayload.statusMessage = getXmlElementAsString(requestBody.XML.TxnStatus);

        if (getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst) {
          payerStatusObj.responseCode = getXmlElementAsString(requestBody.XML.Payer.RespCode);
          payerStatusObj.reversalResponseCode = getXmlElementAsString(requestBody.XML.Payer.RevRespCode);
        } else {
          payerStatusObj.responseCode = emptyStringConst;
          payerStatusObj.reversalResponseCode = emptyStringConst;
        }

        if (getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst) {
          payeeStatusObj.responseCode = getXmlElementAsString(requestBody.XML.Payee.RespCode);
          payeeStatusObj.reversalResponseCode = getXmlElementAsString(requestBody.XML.Payee.RevRespCode);
        } else {
          payeeStatusObj.responseCode = emptyStringConst;
          payeeStatusObj.reversalResponseCode = emptyStringConst;
        }

        jsonPayload.payerStatus = payerStatusObj;
        jsonPayload.payeeStatus = payeeStatusObj;

        if (getXmlElementAsString(requestBody.XML.complaintRefNo) !== emptyStringConst) {
          upiDisputeStatusInfoObj.customerRefNumber = getXmlElementAsString(requestBody.XML.complaintRefNo);
        } else {
          upiDisputeStatusInfoObj.customerRefNumber = emptyStringConst;
        }
        upiDisputeStatusInfoObj.adjustmentFlag = getXmlElementAsString(requestBody.XML.AdjFlag);
        upiDisputeStatusInfoObj.adjustmentReasonCode = getXmlElementAsString(requestBody.XML.AdjCode);
        upiDisputeStatusInfoObj.adjustmentRefId = getXmlElementAsString(requestBody.XML.AdjRefId);
        
        adjustmentAmountObj.currencyCode = currencyCodeConst;
        adjustmentAmountObj.units = getInteger(getXmlElementAsString(requestBody.XML.AdjAmount).split(".")[0]);
        adjustmentAmountObj.nanos = getXmlElementAsString(requestBody.XML.AdjAmount).split(".")[1] === undefined ? 0 : getInteger(("0." + requestBody.XML.AdjAmount.toString().split(".")[1]) * 1000000000);
        upiDisputeStatusInfoObj.adjustmentAmount = adjustmentAmountObj;

        upiDisputeStatusInfoObj.adjustmentTime = getXmlElementAsString(requestBody.XML.AdjTs);
        upiDisputeStatusInfoObj.originalAdjustmentFlag = getXmlElementAsString(requestBody.XML.ReqAdjFlag);
        upiDisputeStatusInfoObj.originalAdjustmentReasonCode = getXmlElementAsString(requestBody.XML.RejectReason);

        originalAdjustmentAmountObj.currencyCode = currencyCodeConst;
        originalAdjustmentAmountObj.units = getInteger(getXmlElementAsString(requestBody.XML.ReqAdjAmount).split(".")[0]);
        originalAdjustmentAmountObj.nanos = getXmlElementAsString(requestBody.XML.ReqAdjAmount).split(".")[1] === undefined ? 0 : getInteger(("0." + requestBody.XML.ReqAdjAmount.toString().split(".")[1]) * 1000000000);
        upiDisputeStatusInfoObj.originalAdjustmentAmount = originalAdjustmentAmountObj;
        
        // upiDisputeStatusInfoObj.remitterActionAdjustmentCode = getXmlElementAsString(requestBody.XML.remitterActionAdjCode);
        // upiDisputeStatusInfoObj.remitterActionAdjustmentFlag = getXmlElementAsString(requestBody.XML.remitterActionAdjFlag);

        jsonPayload.upiDisputeStatusInfo = upiDisputeStatusInfoObj;

        break;

      case "MANDATE-CREATE":
        jsonPayload.transaction_id = getXmlElementAsString(requestBody.XML.transaction_id);
        jsonPayload.request_type = getXmlElementAsString(requestBody.XML.request_type);
        jsonPayload.expire_time = getXmlElementAsString(requestBody.XML.expire_time);
        if (getXmlElementAsString(requestBody.XML.mandate) !== emptyStringConst) {
          mandateObj.umn = getXmlElementAsString(requestBody.XML.mandate.umn);
          mandateObj.payer_vpa = getXmlElementAsString(requestBody.XML.mandate.payer_vpa);
          mandateObj.payee_vpa = getXmlElementAsString(requestBody.XML.mandate.payee_vpa);
          mandateObj.payer_name = getXmlElementAsString(requestBody.XML.mandate.payer_name);
          mandateObj.payee_name = getXmlElementAsString(requestBody.XML.mandate.payee_name);
          mandateObj.mandate_name = getXmlElementAsString(requestBody.XML.mandate.mandate_name);
          mandateObj.validity_start_time = getXmlElementAsString(requestBody.XML.mandate.validity_start_time);
          mandateObj.validity_end_time = getXmlElementAsString(requestBody.XML.mandate.validity_end_time);
          mandateObj.revocable = getXmlElementAsString(requestBody.XML.mandate.revocable);
          mandateObj.amount_rule = getXmlElementAsString(requestBody.XML.mandate.amount_rule);
          mandateObj.recurrence = getXmlElementAsString(requestBody.XML.mandate.recurrence);
          if( mandateObj.recurrence === "ONETIME"){
              mandateObj.recurrence = "ONE_TIME";
          }
          if( mandateObj.recurrence === "HALFYEARLY"){
              mandateObj.recurrence = "HALF_YEARLY";
          }
          if( mandateObj.recurrence === "ASPRESENTED"){
              mandateObj.recurrence = "AS_PRESENTED";
          }
          if (getXmlElementAsString(requestBody.XML.mandate.amount) !== emptyStringConst) {
            amountObj.currencyCode = getXmlElementAsString(requestBody.XML.mandate.amount.currencyCode);
            amountObj.units = getXmlElementAsString(requestBody.XML.mandate.amount.units) !== emptyStringConst ? getInteger(getXmlElementAsString(requestBody.XML.mandate.amount.units)) : 0;
            amountObj.nanos = getXmlElementAsString(requestBody.XML.mandate.amount.nanos) !== emptyStringConst ? getInteger(getXmlElementAsString(requestBody.XML.mandate.amount.nanos)) : 0;
          } else {
            amountObj.currencyCode = emptyStringConst;
            amountObj.units = 0;
            amountObj.nanos = 0;
          }
          mandateObj.amount = amountObj;

          if (getXmlElementAsString(requestBody.XML.mandate.execution_restriction) !== emptyStringConst) {
            
              execution_restrictionObj.debit_rule_type = getXmlElementAsString(requestBody.XML.mandate.execution_restriction.debit_rule_type);
              execution_restrictionObj.debit_day = getXmlElementAsString(requestBody.XML.mandate.execution_restriction.debit_day);
            
            
          } else {
            execution_restrictionObj.debit_rule_type = emptyStringConst;
            execution_restrictionObj.debit_day = emptyStringConst;
          }
          if(mandateObj.recurrence != "AS_PRESENTED" && mandateObj.recurrence != "DAILY"  && mandateObj.recurrence != "ONE_TIME"){
            mandateObj.execution_restriction = execution_restrictionObj;
          }
          

        } else {
          mandateObj.umn = emptyStringConst;
          mandateObj.payer_vpa = emptyStringConst;
          mandateObj.payee_vpa = emptyStringConst;
          mandateObj.payer_name = emptyStringConst;
          mandateObj.payee_name = emptyStringConst;
          mandateObj.mandate_name = emptyStringConst;
          mandateObj.validity_start_time = emptyStringConst;
          mandateObj.validity_end_time = emptyStringConst;
          mandateObj.revocable = emptyStringConst;
          mandateObj.amount_rule = emptyStringConst;
          mandateObj.recurrence = emptyStringConst;
          amountObj.currencyCode = emptyStringConst;
          amountObj.units = 0;
          amountObj.nanos = 0;
          mandateObj.amount = amountObj;
          execution_restrictionObj.debit_rule_type = emptyStringConst;
          execution_restrictionObj.debit_day = emptyStringConst;
          mandateObj.amount = execution_restrictionObj;
        }
        mandateObj.note = getXmlElementAsString(requestBody.XML.note);
        mandateObj.mandate_ref_url = getXmlElementAsString(requestBody.XML.mandate_ref_url);
        mandateObj.purpose_code = getXmlElementAsString(requestBody.XML.purpose_code);
        if (getXmlElementAsString(requestBody.XML.merchant_metadata) !== emptyStringConst) {
          merchant_metadataObj.merchant_category_code = getXmlElementAsString(requestBody.XML.merchant_metadata.merchant_category_code);
          merchant_metadataObj.merchant_type = getXmlElementAsString(requestBody.XML.merchant_metadata.merchant_type);
          merchant_metadataObj.merchant_ref_id = getXmlElementAsString(requestBody.XML.merchant_metadata.merchant_ref_id);
        } else {
          merchant_metadataObj.merchant_category_code = emptyStringConst;
          merchant_metadataObj.merchant_type = emptyStringConst;
          merchant_metadataObj.merchant_ref_id = emptyStringConst;
        }
        mandateObj.merchant_metadata = merchant_metadataObj;
        jsonPayload.mandate = mandateObj;
        break;

      case "MANDATE-RESPONSE":
      case "MANDATE-CONFIRMATION":
        jsonPayload.transaction_id = getXmlElementAsString(requestBody.XML.transaction_id);
        jsonPayload.request_type = getXmlElementAsString(requestBody.XML.request_type);
        jsonPayload.status = getXmlElementAsString(requestBody.XML.status);
        jsonPayload.response_code = getXmlElementAsString(requestBody.XML.response_code);
        if (getXmlElementAsString(requestBody.XML.mandate) !== emptyStringConst) {
          mandateObj.umn = getXmlElementAsString(requestBody.XML.mandate.umn);
          mandateObj.payer_vpa = getXmlElementAsString(requestBody.XML.mandate.payer_vpa);
          mandateObj.payee_vpa = getXmlElementAsString(requestBody.XML.mandate.payee_vpa);
          mandateObj.payer_name = getXmlElementAsString(requestBody.XML.mandate.payer_name);
          mandateObj.payee_name = getXmlElementAsString(requestBody.XML.mandate.payee_name);
          mandateObj.mandate_name = getXmlElementAsString(requestBody.XML.mandate.mandate_name);
          mandateObj.validity_start_time = getXmlElementAsString(requestBody.XML.mandate.validity_start_time);
          mandateObj.validity_end_time = getXmlElementAsString(requestBody.XML.mandate.validity_end_time);
          mandateObj.revocable = getXmlElementAsString(requestBody.XML.mandate.revocable);
          mandateObj.amount_rule = getXmlElementAsString(requestBody.XML.mandate.amount_rule);
          mandateObj.recurrence = getXmlElementAsString(requestBody.XML.mandate.recurrence);
          if( mandateObj.recurrence === "ONETIME"){
              mandateObj.recurrence = "ONE_TIME";
          }
          if( mandateObj.recurrence === "HALFYEARLY"){
              mandateObj.recurrence = "HALF_YEARLY";
          }
          if( mandateObj.recurrence === "ASPRESENTED"){
              mandateObj.recurrence = "AS_PRESENTED";
          }
          if (getXmlElementAsString(requestBody.XML.mandate.amount) !== emptyStringConst) {
            amountObj.currencyCode = getXmlElementAsString(requestBody.XML.mandate.amount.currencyCode);
            amountObj.units = getXmlElementAsString(requestBody.XML.mandate.amount.units) !== emptyStringConst ? getInteger(getXmlElementAsString(requestBody.XML.mandate.amount.units)) : 0;
            amountObj.nanos = getXmlElementAsString(requestBody.XML.mandate.amount.nanos) !== emptyStringConst ? getInteger(getXmlElementAsString(requestBody.XML.mandate.amount.nanos)) : 0;
          } else {
            amountObj.currencyCode = emptyStringConst;
            amountObj.units = 0;
            amountObj.nanos = 0;
          }
          mandateObj.amount = amountObj;

          if (getXmlElementAsString(requestBody.XML.mandate.execution_restriction) !== emptyStringConst) {
            execution_restrictionObj.debit_rule_type = getXmlElementAsString(requestBody.XML.mandate.execution_restriction.debit_rule_type);
            execution_restrictionObj.debit_day = getXmlElementAsString(requestBody.XML.mandate.execution_restriction.debit_day);
          } else {
            execution_restrictionObj.debit_rule_type = emptyStringConst;
            execution_restrictionObj.debit_day = emptyStringConst;
          }
          if(mandateObj.recurrence != "AS_PRESENTED"  && mandateObj.recurrence != "DAILY"  && mandateObj.recurrence != "ONE_TIME"){
            mandateObj.execution_restriction = execution_restrictionObj;
          }

        } else {
          mandateObj.umn = emptyStringConst;
          mandateObj.payer_vpa = emptyStringConst;
          mandateObj.payee_vpa = emptyStringConst;
          mandateObj.payer_name = emptyStringConst;
          mandateObj.payee_name = emptyStringConst;
          mandateObj.mandate_name = emptyStringConst;
          mandateObj.validity_start_time = emptyStringConst;
          mandateObj.validity_end_time = emptyStringConst;
          mandateObj.revocable = emptyStringConst;
          mandateObj.amount_rule = emptyStringConst;
          mandateObj.recurrence = emptyStringConst;
          amountObj.currencyCode = emptyStringConst;
          amountObj.units = 0;
          amountObj.nanos = 0;
          mandateObj.amount = amountObj;
          execution_restrictionObj.debit_rule_type = emptyStringConst;
          execution_restrictionObj.debit_day = emptyStringConst;
          mandateObj.amount = execution_restrictionObj;
        }
        mandateObj.note = getXmlElementAsString(requestBody.XML.note);
        mandateObj.mandate_ref_url = getXmlElementAsString(requestBody.XML.mandate_ref_url);
        mandateObj.purpose_code = getXmlElementAsString(requestBody.XML.purpose_code);
        if (getXmlElementAsString(requestBody.XML.merchant_metadata) !== emptyStringConst) {
          merchant_metadataObj.merchant_category_code = getXmlElementAsString(requestBody.XML.merchant_metadata.merchant_category_code);
          merchant_metadataObj.merchant_type = getXmlElementAsString(requestBody.XML.merchant_metadata.merchant_type);
          merchant_metadataObj.merchant_ref_id = getXmlElementAsString(requestBody.XML.merchant_metadata.merchant_ref_id);
        } else {
          merchant_metadataObj.merchant_category_code = emptyStringConst;
          merchant_metadataObj.merchant_type = emptyStringConst;
          merchant_metadataObj.merchant_ref_id = emptyStringConst;
        }
        mandateObj.merchant_metadata = merchant_metadataObj;
        jsonPayload.mandate = mandateObj;

        jsonPayload.initiated_by = getXmlElementAsString(requestBody.XML.mandate.initiated_by);
        jsonPayload.shared = getXmlElementAsString(requestBody.XML.mandate.shared);
        jsonPayload.pause_start_date = getXmlElementAsString(requestBody.XML.mandate.paused_from);
        jsonPayload.pause_end_date = getXmlElementAsString(requestBody.XML.mandate.paused_until);

        break;

      case "MANDATE_COLLECT":
        jsonPayload.transaction_id = getXmlElementAsString(requestBody.XML.transaction_id);
        jsonPayload.note = getXmlElementAsString(requestBody.XML.note);
        jsonPayload.response_code = getXmlElementAsString(requestBody.XML.response_code);
        jsonPayload.mandate_ref_url = getXmlElementAsString(requestBody.XML.mandate_ref_url);
        jsonPayload.request_type = getXmlElementAsString(requestBody.XML.request_type);
        jsonPayload.purpose_code = getXmlElementAsString(requestBody.XML.purpose_code);
        jsonPayload.status = getXmlElementAsString(requestBody.XML.status);
        if (getXmlElementAsString(requestBody.XML.mandate) !== emptyStringConst) {
          mandateObj.recurrence = getXmlElementAsString(requestBody.XML.mandate.recurrence);
          if( mandateObj.recurrence === "ONETIME"){
              mandateObj.recurrence = "ONE_TIME";
          }
          if( mandateObj.recurrence === "HALFYEARLY"){
              mandateObj.recurrence = "HALF_YEARLY";
          }
          if( mandateObj.recurrence === "ASPRESENTED"){
              mandateObj.recurrence = "AS_PRESENTED";
          }
          mandateObj.amount_rule = getXmlElementAsString(requestBody.XML.mandate.amount_rule);
          mandateObj.mandate_name = getXmlElementAsString(requestBody.XML.mandate.mandate_name);
          mandateObj.validity_end_time = getXmlElementAsString(requestBody.XML.mandate.validity_end_time);
          mandateObj.umn = getXmlElementAsString(requestBody.XML.mandate.umn);
          mandateObj.payee_name = getXmlElementAsString(requestBody.XML.mandate.payee_name);
          mandateObj.payee_vpa = getXmlElementAsString(requestBody.XML.mandate.payee_vpa);
          mandateObj.revocable = getXmlElementAsString(requestBody.XML.mandate.revocable) !== emptyStringConst ? (requestBody.XML.mandate.revocable === "true" ? true : false) : emptyStringConst;
          mandateObj.payer_vpa = getXmlElementAsString(requestBody.XML.mandate.payer_vpa);
          mandateObj.payer_name = getXmlElementAsString(requestBody.XML.mandate.payer_name);
          mandateObj.validity_start_time = getXmlElementAsString(requestBody.XML.mandate.validity_start_time);
          if (getXmlElementAsString(requestBody.XML.mandate.amount) !== emptyStringConst) {
            amountObj.currencyCode = getXmlElementAsString(requestBody.XML.mandate.amount.currencyCode);
            amountObj.units = getXmlElementAsString(requestBody.XML.mandate.amount.units) !== emptyStringConst ? getInteger(getXmlElementAsString(requestBody.XML.mandate.amount.units)) : 0;
            amountObj.nanos = getXmlElementAsString(requestBody.XML.mandate.amount.nanos) !== emptyStringConst ? getInteger(getXmlElementAsString(requestBody.XML.mandate.amount.nanos)) : 0;
          } else {
            amountObj.currencyCode = emptyStringConst;
            amountObj.units = 0;
            amountObj.nanos = 0;
          }
          mandateObj.amount = amountObj;
        } else {
          mandateObj.recurrence = emptyStringConst;
          mandateObj.amount_rule = emptyStringConst;
          mandateObj.mandate_name = emptyStringConst;
          mandateObj.validity_end_time = emptyStringConst;
          mandateObj.umn = emptyStringConst;
          mandateObj.payee_name = emptyStringConst;
          mandateObj.payee_vpa = emptyStringConst;
          mandateObj.revocable = emptyStringConst;
          mandateObj.payer_vpa = emptyStringConst;
          mandateObj.payer_name = emptyStringConst;
          mandateObj.validity_start_time = emptyStringConst;
          amountObj.currencyCode = emptyStringConst;
          amountObj.units = 0;
          amountObj.nanos = 0;
          mandateObj.amount = amountObj;
        }
        jsonPayload.mandate = mandateObj;
        if (getXmlElementAsString(requestBody.XML.merchant_metadata) !== emptyStringConst) {
          merchant_metadataObj.merchant_category_code = getXmlElementAsString(requestBody.XML.merchant_metadata.merchant_category_code);
          merchant_metadataObj.merchant_type = getXmlElementAsString(requestBody.XML.merchant_metadata.merchant_type);
          merchant_metadataObj.merchant_ref_id = getXmlElementAsString(requestBody.XML.merchant_metadata.merchant_ref_id);
        } else {
          merchant_metadataObj.merchant_category_code = emptyStringConst;
          merchant_metadataObj.merchant_type = emptyStringConst;
          merchant_metadataObj.merchant_ref_id = emptyStringConst;
        }
        jsonPayload.merchant_metadata = merchant_metadataObj;
        break;

      case "COLLECT-REQUEST":
        upiTransactionInfoObj.transactionId = getXmlElementAsString(requestBody.XML.OriginalTxnId);
        upiTransactionInfoObj.payerVpa = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.VA) : emptyStringConst;
        upiTransactionInfoObj.payeeVpa = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.VA) : emptyStringConst;
        if (getXmlElementAsString(requestBody.XML.Amount) !== emptyStringConst) {
          amountObj.currencyCode = currencyCodeConst;
          amountObj.units = getInteger(getXmlElementAsString(requestBody.XML.Amount).split(".")[0]);
          amountObj.nanos = getXmlElementAsString(requestBody.XML.Amount).split(".")[1] === undefined ? 0 : getInteger(("0." + getXmlElementAsString(requestBody.XML.Amount).split(".")[1]) * 1000000000);
        } else {
          amountObj.currencyCode = currencyCodeConst;
          amountObj.units = 0;
          amountObj.nanos = 0;
        }
        upiTransactionInfoObj.amount = amountObj;
        upiTransactionInfoObj.expireTime = getXmlElementAsString(requestBody.XML.TxnCompletionDate) !== emptyStringConst ? (getUTCDate(getXmlElementAsString(requestBody.XML.TxnCompletionDate))) : emptyStringConst;
        /* GST changes */
        upiTransactionInfoObj.payerName = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.Name) : emptyStringConst;
        /* GST changes */
        upiTransactionInfoObj.payeeName = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.Name) : emptyStringConst;
        upiTransactionInfoObj.payeeRemarks = getXmlElementAsString(requestBody.XML.Note);
        upiTransactionInfoObj.payerRemarks = emptyStringConst;
        upiTransactionInfoObj.upiRefId = getXmlElementAsString(requestBody.XML.Rrn);
        upiTransactionInfoObj.vendorReferenceId = getXmlElementAsString(requestBody.XML.UpiTranlogId);
        upiTransactionInfoObj.payeeMaskedAccountNo = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.AccountNo) : emptyStringConst;
        upiTransactionInfoObj.payerMaskedAccountNo = emptyStringConst;
        upiTransactionInfoObj.payeeBankIfsc = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.Ifsc) : emptyStringConst;
        upiTransactionInfoObj.payerBankIfsc = emptyStringConst;
        jsonPayload.upiTransactionInfo = upiTransactionInfoObj;
        jsonPayload.creationTime = getXmlElementAsString(requestBody.XML.TxnInitDate) !== emptyStringConst ? getUTCDate(getXmlElementAsString(requestBody.XML.TxnInitDate)) : emptyStringConst;

        merchant_metadataObj.merchantCategoryCode = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.MccCode) : emptyStringConst;
        merchant_metadataObj.merchantType = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.MccType) : emptyStringConst;
        merchant_metadataObj.merchantRefId = emptyStringConst;
        jsonPayload.merchantMetadata = merchant_metadataObj;

        /* GST changes */
        gstMainObj.gstin = getXmlElementAsString(requestBody.XML.Gstin);
        if (getXmlElementAsString(requestBody.XML.Gst) !== emptyStringConst) {
          gstObj.currencyCode = currencyCodeConst;
          gstObj.units = getInteger(getXmlElementAsString(requestBody.XML.Gst.Amount).split(".")[0]);
          gstObj.nanos = getXmlElementAsString(requestBody.XML.Gst.Amount).split(".")[1] === undefined ? 0 : getInteger(("0." + getXmlElementAsString(requestBody.XML.Gst.Amount).split(".")[1]) * 1000000000);
        } else {
          gstObj.currencyCode = currencyCodeConst;
          gstObj.units = 0;
          gstObj.nanos = 0;
        }
        gstBreakUpObj.gst = gstObj;

        if (getXmlElementAsString(requestBody.XML.Gst) !== emptyStringConst) {
          cgstObj.currencyCode = currencyCodeConst;
          cgstObj.units = getInteger(getXmlElementAsString(requestBody.XML.Gst.Cgst).split(".")[0]);
          cgstObj.nanos = getXmlElementAsString(requestBody.XML.Gst.Cgst).split(".")[1] === undefined ? 0 : getInteger(("0." + getXmlElementAsString(requestBody.XML.Gst.Cgst).split(".")[1]) * 1000000000);
        } else {
          cgstObj.currencyCode = currencyCodeConst;
          cgstObj.units = 0;
          cgstObj.nanos = 0;
        }
        gstBreakUpObj.cgst = cgstObj;

        if (getXmlElementAsString(requestBody.XML.Gst) !== emptyStringConst) {
          sgstObj.currencyCode = currencyCodeConst;
          sgstObj.units = getInteger(getXmlElementAsString(requestBody.XML.Gst.Sgst).split(".")[0]);
          sgstObj.nanos = getXmlElementAsString(requestBody.XML.Gst.Sgst).split(".")[1] === undefined ? 0 : getInteger(("0." + getXmlElementAsString(requestBody.XML.Gst.Sgst).split(".")[1]) * 1000000000);
        } else {
          sgstObj.currencyCode = currencyCodeConst;
          sgstObj.units = 0;
          sgstObj.nanos = 0;
        }
        gstBreakUpObj.sgst = sgstObj;

        if (getXmlElementAsString(requestBody.XML.Gst) !== emptyStringConst) {
          igstObj.currencyCode = currencyCodeConst;
          igstObj.units = getInteger(getXmlElementAsString(requestBody.XML.Gst.Igst).split(".")[0]);
          igstObj.nanos = getXmlElementAsString(requestBody.XML.Gst.Igst).split(".")[1] === undefined ? 0 : getInteger(("0." + getXmlElementAsString(requestBody.XML.Gst.Igst).split(".")[1]) * 1000000000);
        } else {
          igstObj.currencyCode = currencyCodeConst;
          igstObj.units = 0;
          igstObj.nanos = 0;
        }
        gstBreakUpObj.igst = igstObj;

        if (getXmlElementAsString(requestBody.XML.Gst) !== emptyStringConst) {
          cessObj.currencyCode = currencyCodeConst;
          cessObj.units = getInteger(getXmlElementAsString(requestBody.XML.Gst.Cess).split(".")[0]);
          cessObj.nanos = getXmlElementAsString(requestBody.XML.Gst.Cess).split(".")[1] === undefined ? 0 : getInteger(("0." + getXmlElementAsString(requestBody.XML.Gst.Cess).split(".")[1]) * 1000000000);
        } else {
          cessObj.currencyCode = currencyCodeConst;
          cessObj.units = 0;
          cessObj.nanos = 0;
        }
        gstBreakUpObj.cess = cessObj;

        gstMainObj.gstBreakUp = gstBreakUpObj;
        jsonPayload.gst = gstMainObj;
        
        if (getXmlElementAsString(requestBody.XML.Invoice) !== emptyStringConst) {
          invoiceObj.invoiceNumber = getXmlElementAsString(requestBody.XML.Invoice.InvoiceNumber);
          invoiceObj.invoiceTime = getXmlElementAsString(requestBody.XML.Invoice.InvoiceDate);
          invoiceObj.invoiceUri = getXmlElementAsString(requestBody.XML.Invoice.InvoiceUrl);
          jsonPayload.invoice = invoiceObj;
        }
        /* GST changes */
        break;
        //mandateMetadataObj.umn = getXmlElementAsString(requestBody.XML.MandateMetadat.Umn);
        //mandateMetadataObj.sequenceNumber = getXmlElementAsString(requestBody.XML.MandateMetadat.SequenceNumber);
        //jsonPayload.mandateMetadata = mandateMetadataObj;

        

      case "COLLECT":
        jsonPayload.statusCode = getXmlElementAsString(requestBody.XML.ResponseCode);
        jsonPayload.statusMessage = getXmlElementAsString(requestBody.XML.TxnStatus);
        upiTransactionStatusMetadataObj.transactionRequestType = "UPI_COLLECT";
        upiTransactionInfoObj.transactionId = getXmlElementAsString(requestBody.XML.OriginalTxnId);
        upiTransactionInfoObj.payerVpa = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.VA) : emptyStringConst;
        upiTransactionInfoObj.payeeVpa = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.VA) : emptyStringConst;
        if (getXmlElementAsString(requestBody.XML.Amount) !== emptyStringConst) {
          amountObj.currencyCode = currencyCodeConst;
          amountObj.units = getInteger(getXmlElementAsString(requestBody.XML.Amount).split(".")[0]);
          amountObj.nanos = getXmlElementAsString(requestBody.XML.Amount).split(".")[1] === undefined ? 0 : getInteger(("0." + getXmlElementAsString(requestBody.XML.Amount).split(".")[1]) * 1000000000);
        } else {
          amountObj.currencyCode = currencyCodeConst;
          amountObj.units = 0;
          amountObj.nanos = 0;
        }
        upiTransactionInfoObj.amount = amountObj;
        upiTransactionInfoObj.expireTime = getXmlElementAsString(requestBody.XML.TxnCompletionDate) !== emptyStringConst ? getUTCDate(getXmlElementAsString(requestBody.XML.TxnCompletionDate)) : emptyStringConst;
        upiTransactionInfoObj.payeeName = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.Name) : emptyStringConst;
        upiTransactionInfoObj.payeeRemarks = getXmlElementAsString(requestBody.XML.Note);
        upiTransactionInfoObj.payerRemarks = emptyStringConst;
        upiTransactionInfoObj.payeeMaskedAccountNo = emptyStringConst;
        upiTransactionInfoObj.payerMaskedAccountNo = emptyStringConst;
        upiTransactionInfoObj.upiRefId = getXmlElementAsString(requestBody.XML.Rrn);
        upiTransactionInfoObj.vendorReferenceId = getXmlElementAsString(requestBody.XML.UpiTranlogId);
        upiTransactionInfoObj.payeeBankIfsc = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.Ifsc) : emptyStringConst;
        upiTransactionInfoObj.payerBankIfsc = emptyStringConst;
        upiTransactionStatusMetadataObj.upiTransactionInfo = upiTransactionInfoObj;
        jsonPayload.upiTransactionStatusMetadata = upiTransactionStatusMetadataObj;
        payerStatusObj.responseCode = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.RespCode) : emptyStringConst;
        payerStatusObj.reversalResponseCode = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.RevRespCode) : emptyStringConst;
        jsonPayload.payerStatus = payerStatusObj;
        payeeStatusObj.responseCode = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.RespCode) : emptyStringConst;
        payeeStatusObj.reversalResponseCode = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.RevRespCode) : emptyStringConst;
        jsonPayload.payeeStatus = payeeStatusObj;
        break;

      case "UPI_PAY_TO_ACQUIRED_MERCHANT":
        upiTransactionStatusMetadataObj.transactionRequestType = "UPI_PAY_TO_ACQUIRED_MERCHANT";
        upiTransactionInfoObj.transactionId = getXmlElementAsString(requestBody.XML.OriginalTxnId);
        upiTransactionInfoObj.payerVpa = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.VA) : emptyStringConst;
        // upiTransactionInfoObj.AccountType = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.AccountType) : emptyStringConst;
        upiTransactionInfoObj.payeeVpa = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.VA) : emptyStringConst;
        if (getXmlElementAsString(requestBody.XML.Amount) !== emptyStringConst) {
          amountObj.currencyCode = currencyCodeConst;
          amountObj.units = getInteger(getXmlElementAsString(requestBody.XML.Amount).split(".")[0]);
          amountObj.nanos = getXmlElementAsString(requestBody.XML.Amount).split(".")[1] === undefined ? 0 : getInteger(("0." + requestBody.XML.Amount.toString().split(".")[1]) * 1000000000);
        } else {
          amountObj.currencyCode = currencyCodeConst;
          amountObj.units = 0;
          amountObj.nanos = 0;
        }
        upiTransactionInfoObj.amount = amountObj;
        // upiTransactionInfoObj.expireTime = getXmlElementAsString(requestBody.XML.TxnCompletionDate) !== emptyStringConst ? getUTCDate(getXmlElementAsString(requestBody.XML.TxnCompletionDate)) : emptyStringConst;
        upiTransactionInfoObj.payerName = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.Name) : emptyStringConst;
        upiTransactionInfoObj.payeeName = getXmlElementAsString(requestBody.XML.Payee) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payee.Name) : emptyStringConst;
        upiTransactionInfoObj.payeeRemarks = emptyStringConst;
        upiTransactionInfoObj.payerRemarks = getXmlElementAsString(requestBody.XML.Note);
        upiTransactionInfoObj.upiRefId = getXmlElementAsString(requestBody.XML.Rrn);
        var AccType;
        upiTransactionInfoObj.payerAccountType = AccType = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.AccountType) : emptyStringConst;
        if (AccType == "CREDIT") {
            var bin = getXmlElementAsString(requestBody.XML.Payer) !== emptyStringConst ? getXmlElementAsString(requestBody.XML.Payer.bin) : emptyStringConst;
            upiCardInfoObj.bin = bin;
            upiTransactionInfoObj.upiCardInfo = upiCardInfoObj;
        }
        
        var basePath = context.getVariable('proxy.basepath')
        if(basePath =="/api/v1/callback2/googleonline"){
            upiTransactionInfoObj.merchantReferenceId = getXmlElementAsString(requestBody.XML.RefId);
        }else{
         upiTransactionInfoObj.merchantReferenceId = getXmlElementAsString(requestBody.XML.UpiTranlogId);
        }

        upiTransactionStatusMetadataObj.upiTransactionInfo = upiTransactionInfoObj;
        jsonPayload.upiTransactionStatusMetadata = upiTransactionStatusMetadataObj;

        jsonPayload.statusCode = getXmlElementAsString(requestBody.XML.ResponseCode);
        jsonPayload.statusMessage = getXmlElementAsString(requestBody.XML.TxnStatus);

        upiTransactionDebugInfoObj.payeePspReqTxnConfirmationTime = getXmlElementAsString(requestBody.XML.payeePspReqTxnConfirmationTime) !== emptyStringConst ?(getXmlElementAsString(requestBody.XML.payeePspReqTxnConfirmationTime)) : emptyStringConst;
        upiTransactionDebugInfoObj.payeePspTxnConfirmationCallbackInitiationTime =getXmlElementAsString(requestBody.XML.payeePspTxnConfirmationCallbackInitiationTime) !== emptyStringConst ?(getXmlElementAsString(requestBody.XML.payeePspTxnConfirmationCallbackInitiationTime)) : emptyStringConst;
        jsonPayload.upiTransactionDebugInfo = upiTransactionDebugInfoObj;
      break;
      
     
      
    case "REQMAPPERCONFIRMATION":
        var requestBody = JSON.parse(context.getVariable('request.content'));
        print(requestBody)
        jsonPayload = requestBody.XML
        
           
            
        // upiTransactionInfoObj.transactionRequestType = "REQMAPPERCONFIRMATION";
        // upiTransactionInfoObj.NotificationId = getXmlElementAsString(requestBody.XML.NotificationId);
        // upiTransactionInfoObj.TargetMobile = getXmlElementAsString(requestBody.XML.TargetMobile);
        // upiTransactionInfoObj.UpiTranlogId = getXmlElementAsString(requestBody.XML.UpiTranlogId);
        // upiTransactionInfoObj.UpiTransactionId = getXmlElementAsString(requestBody.XML.UpiTransactionId);
        // upiTransactionInfoObj.OriginalTransactionId = getXmlElementAsString(requestBody.XML.OriginalTransactionId);
        // upiTransactionInfoObj.ChannelCode = getXmlElementAsString(requestBody.XML.ChannelCode);
        // upiTransactionInfoObj.NotificationDate = getXmlElementAsString(requestBody.XML.NotificationDate);
        
        
        
    //   UpiNumberDetailsObj.action=getXmlElementAsString(requestBody.XML.UpiNumberDetails.action)
    //     UpiNumberDetailsObj.previousVpa=getXmlElementAsString(requestBody.XML.UpiNumberDetails.previousVpa)
    //     UpiNumberDetailsObj.upiNumber=getXmlElementAsString(requestBody.XML.UpiNumberDetails.upiNumber);
        
    //     upiTransactionInfoObj.UpiNumberDetails = UpiNumberDetailsObj;
        // jsonPayload.upiTransactionDebugInfo = upiTransactionDebugInfoObj;


      break;
        
        
        
      
      default:
        context.setVariable("CATCH_EXCEPTION", invalidTransactionTypeErr);
        throw "Backend Field Mapping Failed";
    }
    jsonPayload.upiTransactionDebugInfo.payeePspTxnConfirmationCallbackInitiationTime = context.getVariable("callbackInitiationTime")
    jsonPayload.upiTransactionDebugInfo.payeePspTxnConfirmationCallbackRetryCount = context.getVariable("request.header.counts")?context.getVariable("request.header.counts"):0
    //context.removeVariable("request.header.counts");
    context.setVariable("request.content", JSON.stringify(jsonPayload));
  } else {
    context.setVariable("CATCH_EXCEPTION", fieldMappingErr);
    throw "Backend Field Mapping Failed";
  }
} catch (error) {
  context.setVariable("CATCH_EXCEPTION", error);
  throw "Backend Field Mapping Failed";
}


function (datestr) {
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

function verifyNotNull(field) {
  var result = false;
  if (field && field !== null && field !== undefined) {
    result = true;
  }
  return result;
}

function getInteger(xmlElement){
  return isNaN(xmlElement)? 0 : parseInt(xmlElement);
}