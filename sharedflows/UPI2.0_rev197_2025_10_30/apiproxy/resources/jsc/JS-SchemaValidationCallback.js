  var requestContent = context.getVariable("DECODED_DECRYPTED_CONTENT")?context.getVariable("DECODED_DECRYPTED_CONTENT"):context.getVariable("request.content");
context.setVariable("request.content", requestContent);
var Request = JSON.parse(context.getVariable("request.content"));
var txnType = Request.XML.TxnType;
context.setVariable("TXN", txnType);


//========================== Schema Validation ===========================================
try {
    var schema = "";
    if(txnType === "RESP-DELEGATE-CHECK" || txnType === "RESP-DELEGATE-UPDATE" || txnType === "RESP-DELEGATE-REMOVE" || txnType === "DELEGATE-CHECK" || txnType === "DELEGATE-UPDATE" || txnType === "DELEGATE-REMOVE" || txnType === "FINAL-VALIDATE-DELEGATE-AUTH" || txnType === "DELEGATE-AUTH" || txnType === "RESP-DELEGATE-AUTH" || txnType === "RESP-DELEGATE-ADD" || txnType === "COLLECT-REQUEST" || txnType === "PAY" || txnType === "COLLECT" || txnType === "DELEGATE-ADD"){
        schema = {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "type": "object",
              "properties": {
                "XML": {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "MessageType": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,4}$"
                    },
                    "ProcCode": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,6}$"
                    },
                    "NotificationId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,50}$"
                    },
                    "TargetMobile": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,25}$"
                    },
                    "TxnType": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-bA-Z -]{0,50}$"
                    },
                    "ProfileId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,10}$"
                    },
                    "UpiTranlogId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,25}$"
                    },
                    "ExpireAfter": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,10}$"
                    },
                    "Payee": {
                      "type": "object",
                      "properties": {
                        "Name": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z .]{0,100}$"
                        },
                        "Mobile": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9]{0,25}$"
                        },
                        "VA": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9 @.-]{0,255}$"
                        },
                        "BASEVPA":{
                            "type": "string",
                            "pattern": "^(?!.*?--)[a-zA-Z0-9 @.-]{0,255}$"
                        },
                        "RespCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                        },
                        "MccCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9]{0,4}$"
                        },
                        "MccType": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z]{0,50}$"
                        },
                        "AccountNo": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,50}$"
                        },
                        "Ifsc": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,11}$"
                        },
                        "RevRespCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                        },
                        "VerifiedMerchant": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z]{0,10}$"
                        },
                        "Mid":{
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,100}$"
                        }
                      },
                      "required": [
                        // "Name",
                        // "Mobile",
                        // "VA",
                        // "RespCode",
                        // "MccCode",
                        // "MccType",
                        // "AccountNo",
                        // "Ifsc",
                        // "RevRespCode",
                        // "VerifiedMerchant"
                      ]
                    },
                    "Payer": {
                      "type": "object",
                      "properties": {
                        "Name": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z .]{0,100}$"
                        },
                        "Mobile": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9]{0,25}$"
                        },
                        "VA": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9 @.-]{0,255}$"
                        },
                        "AccountNo": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,50}$"
                        },
                        "Ifsc": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,11}$"
                        },
                        "AccountType": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z]{0,20}$"
                        },
                        "RespCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                        },
                        "RevRespCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                        },
                        "GstIncentiveApplicable": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,10}$"
                        },
                        "Mid":{
                           "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,100}$"
                        },
                        "bin":{
                           "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,100}$"
                        },
                        "PurposeCode":{
                            "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,2}$"
                        }
                      },
                      "required": [
                        // "Name",
                        // "Mobile",
                        // "VA",
                        // "AccountNo",
                        // "Ifsc",
                        // "AccountType",
                        // "RespCode",
                        // "RevRespCode",
                        // "GstIncentiveApplicable"
                      ]
                    },
                    "Primary": {
                      "type": "object",
                      "properties": {
                        "Vpa": {
                          "type": "string",
                           "pattern": "^[0-9a-zA-Z -.@]{0,255}$"
                        }
                      },
                      "required": [
                        // "Vpa"
                      ]
                    },
                    "Secondary": {
                      "type": "object",
                      "properties": {
                        "Vpa": {
                          "type": "string",
                           "pattern": "^[0-9a-zA-Z -.@]{0,255}$"
                        }
                      },
                      "required": [
                        // "Vpa"
                      ]
                    },
                    "Amount": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9.]{0,14}$"
                    },
                    "SplitName": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z0-9 .]{0,20}$"
                    },
                    "SplitValue": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z0-9 .]{0,14}$"
                    },
                    "ChannelCode": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z]{0,15}$"
                    },
                    "TxnStatus": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z]{0,20}$"
                    },
                    "TxnInitDate": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                    },
                    "TxnCompletionDate": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                    },
                    "Note": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z0-9 \+@*.-]{0,50}$"
                    },
                    "DeviceId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z0-9 -]{0,50}$"
                    },
                    "OriginalTxnId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,35}$"
                    },
                    "TxnId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,35}$"
                    },
                    "RefId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z ]{0,35}$"
                    },
                    "RefUrl": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z0-9 .:\/]{0,255}$"
                    },
                    "Rrn": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,12}$"
                    },
                    "ComplaintRefNo": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,35}$"
                    },
                    "AdjAmount": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9.]{0,14}$"
                    },
                    "AdjTs": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,20}$"
                    },
                    "AdjRefId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z ]{0,35}$"
                    },
                    "AdjFlag": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,10}$"
                    },
                    "AdjCode": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,10}$"
                    },
                    "AdjRemarks": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z .:\/]{0,50}$"
                    },
                    "ReqAdjFlag": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,10}$"
                    },
                    "ReqAdjCode": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,10}$"
                    },
                    "ReqAdjAmount": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9.]{0,14}$"
                    },
                    "RejectReason": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,100}$"
                    },
                    "CurrCycle": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,10}$"
                    },
                    "OrgSettRespCode": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                    },
                    "ResponseCode": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                    },
                    "ResponseMessage": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,100}$"
                    },
                    "NeedPayerGstConsent": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,10}$"
                    },
                    "IsFromBlockedVpa": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,10}$"
                    },
                    "RiskScores": {
                      "type": "object",
                      "properties": {
                        "Score1": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z =\"]{0,255}$"
                        },
                        "Score2": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z =\"]{0,255}$"
                        }
                      },
                      "required": [
                        // "Score1",
                        // "Score2"
                      ]
                    },
                    "MandateMetadat": {
                      "type": "object",
                      "properties": {
                        "Umn": {
                          "type": "string",
                          "pattern": "^(.*?)[0-9a-zA-Z\@]{0,70}$"
                        },
                        "SequenceNumber": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,35}$"
                        }
                      },
                      "required": [
                        // "Umn",
                        // "SequenceNumber"
                      ]
                    },
                    "Gstin": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,15}$"
                    },
                    "Gst": {
                      "type": "object",
                      "properties": {
                        "Amount": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9.]{0,14}$"
                        },
                        "Cgst": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9.]{0,14}$"
                        },
                        "Sgst": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9.]{0,14}$"
                        },
                        "Igst": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9.]{0,14}$"
                        },
                        "Cess": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9.]{0,14}$"
                        }
                      },
                      "required": [
                        // "Amount",
                        // "Cgst",
                        // "Sgst",
                        // "Igst",
                        // "Cess"
                      ]
                    },
                    "Invoice": {
                      "type": "object",
                      "properties": {
                        "InvoiceNumber": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,100}$"
                        },
                        "InvoiceDate": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9]{0,8}$"
                        },
                        "InvoiceUrl": {
                          "type": "string",
                           "pattern": "^(?!.*?--)[a-zA-Z0-9 .:\/]{0,255}$"
                        }
                      },
                      "required": [
                        // "InvoiceNumber",
                        // "InvoiceDate",
                        // "InvoiceUrl"
                      ]
                    },
                    "payeePspReqTxnConfirmationTime": {
                      "type": "string",
                       "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,20}$"
                    },
                    "payeePspTxnConfirmationCallbackInitiationTime": {
                      "type": "string",
                       "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,20}$"
                    },
                    // "Lite": {
                    //   "type": "string",
                    //   "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,35}$"
                    // },
                    "Mid": {
                      "type": "string",
                       "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,100}$"
                    },
                    "bin": {
                      "type": "string",
                       "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,6}$"
                    }
                  },
                  "required": [
                    "MessageType",
                    "ProcCode",
                    "NotificationId",
                    "TargetMobile",
                    "TxnType",
                    "ProfileId",
                    "UpiTranlogId",
                    // "ExpireAfter",
                    // "Payee",
                    // "Payer",
                    // "Amount",
                    // "ChannelCode",
                    // "TxnStatus",
                    // "TxnInitDate",
                    // "TxnCompletionDate",
                    // "Note",
                    // "DeviceId",
                    // "OriginalTxnId",
                    // "RefId",
                    // "RefUrl",
                    // "Rrn",
                    // "ResponseCode",
                    // "NeedPayerGstConsent",
                    // "IsFromBlockedVpa",
                    // "RiskScores",
                    // "MandateMetadat",
                    // "Gstin",
                    // "Gst",
                    // "Invoice",
                    // "payeePspReqTxnConfirmationTime",
                    // "payeePspTxnConfirmationCallbackInitiationTime",
                    // "Lite"
                    // "Mid",
                    // "bin"
                  ]
                }
              },
              "required": [
                // "XML"
              ]
            };
    } else if(txnType === "MANDATE-RESPONSE" || txnType === "MANDATE-CONFIRMATION" || txnType === "MANDATE-CREATE"){
        schema = {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "type": "object",
              "properties": {
                "XML": {
                  "type": "object",
                  "additionalProperties": false,
                  "properties": {
                    "MessageType": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,4}$"
                    },
                    "ProcCode": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,6}$"
                    },
                    "NotificationId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,50}$"
                    },
                    "TargetMobile": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,25}$"
                    },
                    "TxnType": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z\-]{0,50}$"
                    },
                    "ProfileId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,10}$"
                    },
                    "UpiTranlogId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,25}$"
                    },
                    "ExpireAfter": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,10}$"
                    },
                    "MandateDetails": {
                      "type": "object",
                      "properties": {
                        "MandateName": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,255}$"
                        },
                        "MandateType": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                        },
                        "ValidityStart": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z0-9]{0,20}$"
                        },
                        "ValidityEnd": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                        },
                        "MandateAmount": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9.]{0,14}$"
                        },
                        "Frequency": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z]{0,25}$"
                        },
                        "Revokeable": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[A-Za-z]{0,1}$"
                        },
                        "DebitDay": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,25}$"
                        },
                        "DebitRule": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z]{0,25}$"
                        },
                        "AmountRule": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z]{0,10}$"
                        },
                        "PurposeCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,2}$"
                        },
                        "BlockFund": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z]{0,1}$"
                        },
                        "UMN": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z\@]{0,70}$"
                        },
                        "MandateNote": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z \+@*.-]{0,50}$"
                        },
                        "MandateOriginalTxnId": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,35}$"
                        },
                        "CreatedDate": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                        },
                        "RefUrl": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z:.\/]{0,255}$"
                        },
                        "PauseStart": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                        },
                        "PauseEnd": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                        }
                      },
                      "required": [
                        // "MandateName",
                        // "MandateType",
                        // "ValidityStart",
                        // "ValidityEnd",
                        // "MandateAmount",
                        // "Frequency",
                        // "Revokeable",
                        // "DebitDay",
                        // "DebitRule",
                        // "AmountRule",
                        // "PurposeCode",
                        // "BlockFund",
                        // "UMN",
                        // "MandateNote",
                        // "MandateOriginalTxnId",
                        // "CreatedDate",
                        // "RefUrl",
                        // "PauseStart",
                        // "PauseEnd"
                      ]
                    },
                    "Payee": {
                      "type": "object",
                      "properties": {
                        "Name": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z .]{0,100}$"
                        },
                        "Mobile": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9]{0,25}$"
                        },
                        "VA": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z@.-]{0,255}$"
                        },
                        "RespCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                        },
                        "MccCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9]{0,4}$"
                        },
                        "MccType": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[a-zA-Z]{0,50}$"
                        },
                        "AccountNo": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,50}$"
                        },
                        "Ifsc": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,11}$"
                        },
                        "RevRespCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                        },
                        "BASEVPA":{
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z @.-]{0,255}$"
                        }
                      },
                      "required": [
                        // "Name",
                        // "Mobile",
                        // "VA",
                        // "RespCode",
                        // "MccCode",
                        // "MccType",
                        // "AccountNo",
                        // "Ifsc",
                        // "RevRespCode"
                      ]
                    },
                    "Payer": {
                      "type": "object",
                      "properties": {
                        "Name": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z .]{0,100}$"
                        },
                        "Mobile": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9]{0,25}$"
                        },
                        "VA": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z@.-]{0,255}$"
                        },
                        "AccountNo": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,50}$"
                        },
                        "Ifsc": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,11}$"
                        },
                        "RespCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                        },
                        "RevRespCode": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                        },
                        "AccountType": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                        }
                      },
                      "required": [
                        // "Name",
                        // "Mobile",
                        // "VA",
                        // "AccountNo",
                        // "Ifsc",
                        // "RespCode",
                        // "RevRespCode",
                        // "AccountType"
                      ]
                    },
                    "Amount": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z.]{0,14}$"
                    },
                    "ChannelCode": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z]{0,15}$"
                    },
                    "TxnStatus": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z]{0,20}$"
                    },
                    "TxnInitDate": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                    },
                    "TxnCompletionDate": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                    },
                    "Note": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z \+@*.-]{0,50}$"
                    },
                    "DeviceId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z\-]{0,50}$"
                    },
                    "OriginalTxnId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,35}$"
                    },
                    "RefId": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z ]{0,35}$"
                    },
                    "Rrn": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,12}$"
                    },
                    "SeqNo": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,35}$"
                    },
                    "ResponseCode": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,4}$"
                    },
                    "UMN":{
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z\@]{0,70}$"
                    },
                    "NewRefId":{
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z ]{0,35}$"
                    }
                  },
                  "required": [
                    "MessageType",
                    "ProcCode",
                    "NotificationId",
                    "TargetMobile",
                    "TxnType",
                    "ProfileId",
                    "UpiTranlogId",
                    // "ExpireAfter",
                    // "MandateDetails",
                    // "Payee",
                    // "Payer",
                    // "Amount",
                    // "ChannelCode",
                    // "TxnStatus",
                    // "TxnInitDate",
                    // "TxnCompletionDate",
                    // "Note",
                    // "DeviceId",
                    // "OriginalTxnId",
                    // "RefId",
                    // "Rrn",
                    // "SeqNo",
                    // "ResponseCode",
                    // "UMN",
                    // "NewRefId"
                  ]
                }
              },
              "required": [
                "XML"
              ]
            }
    }
     else if(txnType === "MANDATENOTIFICATION"){
        schema={
          "$schema": "http://json-schema.org/draft-04/schema#",
          "type": "object",
          "properties": {
            "XML": {
              "type": "object",
              "properties": {
                "MessageType": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9]{0,4}$"
                },
                "ProcCode": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,6}$"
                },
                "NotificationId": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9]{0,50}$"
                },
                "TargetMobile": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9]{0,25}$"
                },
                "TxnType": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[a-zA-Z\-]{0,50}$"
                },
                "ProfileId": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9]{0,10}$"
                },
                "UpiTranlogId": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9]{0,25}$"
                },
                "Amount": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z.]{0,14}$"
                },
                "ChannelCode": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[a-zA-Z]{0,15}$"
                },
                "NotificationDate": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9]{0,12}$"
                },
                "ExecutionDateTime": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z \+\:-]{0,255}$"
                },
                "Note": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z \+@*.-]{0,50}$"
                },
                "UMN": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z\@]{0,70}$"
                },
                "MandateName": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,255}$"
                },
                "MandateNickName": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,50}$"
                },
                "Purpose": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,2}$"
                },
                "TxnId": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,35}$"
                },
                "OriginalTxnId": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,35}$"
                },
                "OrgRrn": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9]{0,12}$"
                },
                "RefId": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z ]{0,35}$"
                },
                "Rrn": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9]{0,12}$"
                },
                "ValidityStartDate": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z\-]{0,20}$"
                },
                "ValidityEndDate": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z\-]{0,20}$"
                },
                "Frequency": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[a-zA-Z]{0,25}$"
                },
                "DebitDay": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,25}$"
                },
                "DebitRule": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[a-zA-Z]{0,25}$"
                },
                "Revokable": {
                  "type": "string",
                  "pattern": "^(?!.*?--)[a-zA-Z]{0,1}$"
                },
                "Payee": {
                  "type": "object",
                  "properties": {
                    "Name": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z .]{0,100}$"
                    },
                    "Mobile": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,25}$"
                    },
                    "VA": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z@.-]{0,255}$"
                    },
                    "Code": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,4}$"
                    },
                    "Type": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[a-zA-Z]{0,50}$"
                    },
                    "AccountNo": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,50}$"
                    },
                    "Ifsc": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,11}$"
                    },
                    "Merchant": {
                      "type": "object",
                      "properties": {
                        "Identifier": {
                          "type": "object",
                          "properties": {
                            "subCode": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[0-9]{0,4}$"
                            },
                            "mid": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,100}$"
                            },
                            "sid": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[a-zA-Z]{0,100}$"
                            },
                            "tid": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[a-zA-Z]{0,100}$"
                            },
                            "merchantType": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[a-zA-Z]{0,50}$"
                            },
                            "merchantGenre": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[a-zA-Z]{0,10}$"
                            },
                            "onBoardingType": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[a-zA-Z]{0,15}$"
                            }
                          },
                          "required": [
                            // "subCode",
                            // "mid",
                            // "sid",
                            // "tid",
                            // "merchantType",
                            // "merchantGenre",
                            // "onBoardingType"
                          ]
                        },
                        "Name": {
                          "type": "object",
                          "properties": {
                            "brand": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[a-zA-Z]{0,20}$"
                            },
                            "legal": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[a-zA-Z]{0,20}$"
                            },
                            "franchise": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[a-zA-Z]{0,20}$"
                            }
                          },
                          "required": [
                            // "brand",
                            // "legal",
                            // "franchise"
                          ]
                        },
                        "Ownership": {
                          "type": "object",
                          "properties": {
                            "type": {
                              "type": "string",
                              "pattern": "^(?!.*?--)[a-zA-Z]{0,50}$"
                            }
                          },
                          "required": [
                            "type"
                          ]
                        }
                      },
                      "required": [
                        // "Identifier",
                        // "Name",
                        // "Ownership"
                      ]
                    },
                    "Amount": {
                      "type": "object",
                      "properties": {
                        "value": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9 .]{0,14}$"
                        },
                        "curr": {
                          "type": "string",
                          "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,3}$"
                        }
                      },
                      "required": [
                        // "value",
                        // "curr"
                      ]
                    }
                  },
                  "required": [
                    // "Name",
                    // "Mobile",
                    // "VA",
                    // "Code",
                    // "Type",
                    // "AccountNo",
                    // "Ifsc",
                    // "Merchant",
                    // "Amount"
                  ]
                },
                "Payer": {
                  "type": "object",
                  "properties": {
                    "Name": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z .]{0,100}$"
                    },
                    "Mobile": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,25}$"
                    },
                    "VA": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z@.-]{0,255}$"
                    },
                    "AccountNo": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,50}$"
                    },
                    "Ifsc": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,11}$"
                    },
                    "AccountType": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9a-zA-Z]{0,20}$"
                    },
                    "MandateNotificationSeqNum": {
                      "type": "string",
                      "pattern": "^(?!.*?--)[0-9]{0,10}$"
                    }
                  },
                  "required": [
                    // "Name",
                    // "Mobile",
                    // "VA",
                    // "AccountNo",
                    // "Ifsc",
                    // "AccountType",
                    // "MandateNotificationSeqNum"
                  ]
                }
              },
              "required": [
                "MessageType",
                "ProcCode",
                "NotificationId",
                "TargetMobile",
                "TxnType",
                "ProfileId",
                "UpiTranlogId",
                "Amount",
                // "ChannelCode",
                // "NotificationDate",
                // "ExecutionDateTime",
                // "Note",
                // "UMN",
                // "MandateName",
                // "MandateNickName",
                // "Purpose",
                // "TxnId",
                // "OriginalTxnId",
                // "OrgRrn",
                // "RefId",
                // "Rrn",
                // "ValidityStartDate",
                // "ValidityEndDate",
                // "Frequency",
                // "DebitDay",
                // "DebitRule",
                // "Revokable",
                // "Payee",
                // "Payer"
              ]
            }
          },
          "required": [
            "XML"
          ]
        }
    }
    else{
        schema = false;
    }
         
    // 
// ========================= Validation Schema ==============================
    // var data = JSON.parse(requestContent);
    // var opt = tv4.validate(data, schema);
    // context.setVariable("valid", opt);
    // if (opt === false) {
    //     context.setVariable("SchemaError", tv4.error.message);
    //     validJson();
    // }
    
    
    if (schema != "false") {
        var data = JSON.parse(requestContent);
        var opt = tv4.validate(data, schema);
        context.setVariable("Valid", opt);
        if (opt === false) {
            context.setVariable("ErrorType", "Invalid Data Type");
            context.setVariable("SchemaError", tv4.error.message);
            validJson();
        }
    }
// ========================= Validation Schema ==============================

} catch (err) {
    context.setVariable("CATCH_EXCEPTION_400", err);
    context.setVariable("linenumber", err.lineNumber);
    throw err;
}


function validJson() {
    context.setVariable("exceptionStatus",400);
    var finalResponse = {
        "success": false,
        "errorcode": "400",
        "message": "Bad Request"

    };
    throw JSON.stringify(finalResponse);
}
//==========================End Schema Validation ===========================================