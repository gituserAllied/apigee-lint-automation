var requestContent = context.getVariable("DECODED_DECRYPTED_CONTENT") ? context.getVariable("DECODED_DECRYPTED_CONTENT") : context.getVariable("request.content");
context.setVariable("request.content", requestContent);
var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
var request_verb = context.getVariable("request.verb");
try {
    var schema = "false";
    if (proxyPathSuffix === "/GetTxnStatusBackOffice" && request_verb == "POST") {
        schema = {
            //   "$schema": "http://json-schema.org/draft-04/schema#",
            //   "type": "object",
            //   "properties": {
            //     "device-id": {
            //       "type": "string"
            //     },
            //     "mobile": {
            //       "type": "string"
            //     },
            //     "seq-no": {
            //     "type": "string",
            //       "pattern":"^[0-9a-zA-Z]{0,100}$"
            //     },
            //     "channel-code": {
            //       "type": "string"
            //     },
            //     "profile-id": {
            //       "type": "string"
            //     }
            //   },
            //   "required": [
            //     "device-id",
            //     "mobile",
            //     "seq-no",
            //     "channel-code",
            //     "profile-id"
            //   ]
            // };
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "amount": {
                    //   "type": "string",
                    "pattern": "^[0-9]{0,17}((.){0,1}[0-9]{2})$"
                },
                "ref-id": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9\\-_ ]{1,35}$",
                },
                "channel-code": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9\\-_ ]{1,35}$",
                },
                "payee-va": {
                    "type": "string"
                },
                "type": {
                    "type": "string",
                    // 	  "pattern":"^[0-9a-zA-Z]{1,10}$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9\\-_ ]{1,35}$",
                },
                "rrn": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9\\-_ ]{1,35}$",
                }
            },
            "required": [
                "amount",
                // "ref-id",
                "channel-code",
                "payee-va",
                "type",
                "seq-no",
                "rrn"
            ]
        };
    }
    if (proxyPathSuffix === "/GetToken" && request_verb == "POST") {
        schema = {
        	"$schema": "http://json-schema.org/draft-07/schema#", 
        	"type": "object", 
        	"properties": {
                 "mobile": {
        			"type": "string",
        			"pattern":"^[0-9a-zA-Z]{0,25}$"
         		},
         		"device-id": {
        			"type": "string",
         			"pattern":"^[0-9a-zA-Z -]{0,255}$"
        		},
        		"seq-no": {
         			"type": "string",
            		  //"pattern":"^[0-9a-zA-Z.-@_]{0,35}$"
        		    "pattern":"^[0-9a-zA-Z]{0,35}$"
        		},
         		"channel-code": { 			
         		    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,15}$"
        		},
        		"app-id": {
        			"type": "string",
         			"pattern":"^[0-9a-zA-Z .]{0,255}$"
        		},
        		"sub-type": {
        			"type": "string",
        			"pattern":"^[0-9a-zA-Z]{0,20}$"
        		},
        		"challenge": {
        			"type": "string"
        // 			"pattern":"^[a-zA-Z]{0,1024}$"
        		}
        	},
        	"required": [
        		"mobile",
        		"device-id",
        		"seq-no",
        		"channel-code",
        		"app-id",
        		"sub-type",
        		"challenge"
        	]
        }
    }

    if (proxyPathSuffix === "/GetProfileDetails" && request_verb == "POST") {
         schema = {
        	"$schema": "http://json-schema.org/draft-07/schema#", 
        	"type": "object", 
        	"properties": {
        		"mobile": {
        			"type": "string",
        			"pattern":"^[0-9a-zA-Z]{0,25}$"
        		},
        		"device-id": {
        			"type": "string",
                    "pattern":"^[0-9a-zA-Z -]{0,255}$"
                    // "pattern":"^[0-9a-zA-Z.-@_!@#$%^&*()-+=]{0,255}$"
        		},
        		"seq-no": {
        			"type": "string",
        			"pattern":"^[0-9a-zA-Z]{0,35}$"
        		},
        		"channel-code": { 
        			"type": "string",
        			"pattern":"^[0-9a-zA-Z]{0,15}$"
        		},
        		"profile-id": {
        			"type": "string",
        			"pattern": "^[0-9a-zA-Z]{0,10}$"
        		}
        	},
        	"required": [
        		"mobile",
        		"device-id",
        		"seq-no",
        		"channel-code",
        		"profile-id"
        	]
        }
    }
    else if (proxyPathSuffix === "/ManageInternationalTransaction" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
                "action": {
                    "type": "string"
                },
                "note": {
                    "type": "string"
                },
                "device-id": {
                    "type": "string"
                },
                "mobile": {
                    "type": "string"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9\\-_ ]{1,35}$"
                },
                "channel-code": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9\\-_ ]{1,35}$"
                },
                "virtual-address": {
                    "type": "string"
                }
            },
            "required": [
                "action",
                "device-id",
                "mobile",
                "seq-no",
                "channel-code",
                "virtual-address",
                "note"
            ]
        }
    } else if (proxyPathSuffix === "/ValidateQR" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
                "device-id": {
                    "type": "string"
                },
                "mobile": {
                    "type": "string"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,100}$"
                },
                "channel-code": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9\\-_ ]{1,35}$",
                },
                "virtual-address": {
                    "type": "string"
                },
                "profile-id": {
                    "type": "string"
                }
            },
            "required": [
                "device-id",
                "mobile",
                "seq-no",
                "channel-code",
                "virtual-address",
                "profile-id",
                "qr-payload"
            ]
        }
    } else if (proxyPathSuffix === "/CommonPayRequest" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
                "account-provider": {
                    "type": "string"
                },
                "purpose": {
                    // 			"$id": "#root/purpose",
                    "type": "string"
                },
                "payer-va": {
                    "type": "string"
                },
                "amount": {
                    "type": "string"
                    // 			"pattern": "^[0-9]{0,17}((.){0,1}[0-9]{2})$"
                },
                "note": {
                    "type": "string"
                },
                "txn-type": {
                    "type": "string"
                },
                "device-id": {
                    "type": "string"
                },
                "mobile": {
                    "type": "string"
                },
                "seq-no": {
                    "type": "string",
                    // 			"pattern": "^[A-Za-z0-9\\-_ ]{1,35}$",
                },
                "channel-code": {
                    "type": "string",
                    // 			"pattern": "^[A-Za-z0-9\\-_ ]{1,35}$",
                },
                "profile-id": {
                    "type": "string"
                },
                "default-debit": {
                    "type": "string"
                },
                "default-credit": {
                    "type": "string"
                },
                "pre-approved": {
                    "type": "string"
                }
            },
            "required": [
                // 		"purpose",
                // 		"txn-type",
                // 		"default-debit",
                // 		"default-credit",
                // 		"amount",
                // 		"note",
                // 		"pre-approved",
                // 		"profile-id",
                // 		"payer-va",
                // 		"device-id",
                // 		"mobile",
                // 		"seq-no",
                // 		"channel-code",
                // 		"account-provider",
            ],
        }
    }
    // }else if (proxyPathSuffix === "/GetComplaintList" && request_verb == "POST") {
    //     schema = {
    //  "$schema": "http://json-schema.org/draft-04/schema#",
    //   "type": "object",
    //   "properties": {
    //     "channel-code": {
    //       "type": "string"
    //     },
    //     "mobile": {
    //       "type": "string"
    //     },
    //     "profile-id": {
    //       "type": "string"
    //     },
    //     "device-id": {
    //       "type": "string"
    //     },
    //     "apiType": {
    //       "type": "string"
    //     },
    //     "seq-no": {
    //     "type": "string",
    //       "pattern":"^[0-9a-zA-Z]{0,100}$"
    //     },
    //   "required": [
    //     "channel-code",
    //     "mobile",
    //     "profile-id",
    //     "device-id",
    //     "apiType",
    //     "seq-no"
    //   ]
    //   }
    // };

    // }else if (proxyPathSuffix === "/RaiseTransactionComplaint" && request_verb == "POST") {
    //     schema = {
    //     "$schema": "http://json-schema.org/draft-04/schema#",
    //   "type": "object",
    //   "properties": {
    //     "ori-seq-no": {
    //     "type": "string"
    //       },
    //     "channel-code": {
    //       "type": "string"
    //     },
    //     "mobile": {
    //       "type": "string"
    //     },
    //     "profile-id": {
    //       "type": "string"
    //     },
    //     "remark": {
    //       "type": "string"
    //     },
    //     "sub-type": {
    //       "type": "string"
    //     },
    //     "device-id": {
    //       "type": "string"
    //     },
    //     "apiType": {
    //       "type": "string"
    //     },
    //     "reason-code": {
    //       "type": "string"
    //     },
    //     "seq-no": {
    //       "type": "string",
    //       "pattern":"^[0-9a-zA-Z]{0,100}$"
    //     }
    //   },
    //   "required": [
    //     "ori-seq-no",
    //     "channel-code",
    //     "mobile",
    //     "profile-id",
    //     "remark",
    //     "sub-type",
    //     "device-id",
    //     "apiType",
    //     "reason-code",
    //     "seq-no"
    //   ]
    // };
    // }else if (proxyPathSuffix === "/CheckTransactionDisputeStatus" && request_verb == "POST") {
    //     schema = {
    // "$schema": "http://json-schema.org/draft-04/schema#",
    //   "type": "object",
    //   "properties": {
    //     "ori-seq-no": {
    //     "type": "string"
    //      },
    //     "channel-code": {
    //       "type": "string"
    //     },
    //     "original-txn-type": {
    //       "type": "string"
    //     },
    //     "umn": {
    //       "type": "string"
    //     },
    //     "mobile": {
    //       "type": "string"
    //     },
    //     "profile-id": {
    //       "type": "string"
    //     },
    //     "history": {
    //       "type": "string"
    //     },
    //     "category": {
    //       "type": "string"
    //     },
    //     "device-id": {
    //       "type": "string"
    //     },
    //     "apiType": {
    //       "type": "string"
    //     },
    //     "seq-no": {
    //       "type": "string",
    //       "pattern":"^[0-9a-zA-Z]{0,100}$"
    //     }
    //   },
    //   "required": [
    //     "ori-seq-no",
    //     "channel-code",
    //     "original-txn-type",
    //     "umn",
    //     "mobile",
    //     "profile-id",
    //     "history",
    //     "category",
    //     "device-id",
    //     "apiType",
    //     "seq-no"
    //   ]
    // };
    // }else if (proxyPathSuffix === "/RequestDispute" && request_verb == "POST") {
    //     schema = {

    //   "$schema": "http://json-schema.org/draft-04/schema#",
    //   "type": "object",
    //   "properties": {
    //     "org-id": {
    //       "type": "string"
    //     },
    //     "adj-ref-id": {
    //       "type": "string"
    //     },
    //     "ori-seq-no": {
    //     "type": "string",
    //       "pattern":"^[0-9a-zA-Z]{0,100}$"
    //     },
    //     "adj-flag": {
    //       "type": "string"
    //     },
    //     "adj-reason-code": {
    //       "type": "string"
    //     },
    //     "adj-amount": {
    //       "type": "string"
    //     },
    //     "remarks": {
    //       "type": "string"
    //     }
    //   },
    //   "required": [
    //     "org-id",
    //     "adj-ref-id",
    //     "ori-seq-no",
    //     "adj-flag",
    //     "adj-reason-code",
    //     "adj-amount",
    //     "remarks"
    //   ]
    // }
    // }
    else if (proxyPathSuffix === "/LogRefId" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            // "additionalProperties": false,
            "properties": {
                "channel-code": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,15}$"
                },
                "device-id": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z._-]{0,255}$"
                },
                "MessageType": {
                    "type": "string",
                    "pattern": "^[0-9]{0,5}$"
                },
                "mobile": {
                    "type": "number",
                    "pattern": "^[0-9]{0,10}$"
                },
                "ProcCode": {
                    "type": "string",
                    "pattern": "^[0-9]{0,10}$"
                },
                "profile-id": {
                    "type": "number",
                    "pattern": "^[0-9]{0,10}$"
                },
                "qr-validity-start-datetime": {
                    "type": "string"
                },
                "qr-validity-end-datetime": {
                    "type": "string"
                },
                "ref-id": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z._-]{0,99}$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z._-]{0,35}$"
                },
                // "UPI": {
                //   "type": "string"
                // },
                "updateqr-validity": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,1}$"
                },
                 "payer-amount": {
                    "type": "string",
                    "pattern": "^[0-9 .]{1,15}$",
                    
            },
            // "split-name": {
            //         "type": "string",
            //         "pattern": "^[a-zA-Z]{1,15}$",
            // },
            // "split-value": {
            //         "type": "string",
            //         "pattern": "^[0-9 .]{1,15}$",
            // },
            
            "required": [
                "channel-code",
                "device-id",
                // "MessageType",
                "mobile",
                // "ProcCode",
                "profile-id",
                "ref-id",
                "seq-no",
                // "UPI"

            ]
            }
        };
        
    } else if (proxyPathSuffix === "/RaiseDisputeRefund" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "device-id": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,255}$"
                },
                "mobile": {
                    "type": "number",
                    "pattern": "^[0-9]{0,10}$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,35}$"
                },
                "channel-code": {
                    "type": "string",
                    "pattern": "^[a-zA-Z]{0,15}$"
                },
                "merchant-account-number": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,35}$"
                },
                "merchant-va": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z-@.]{0,255}$"
                },
                "payee-va": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z-@]{0,255}$"
                },
                "profile-id": {
                    "type": "number",
                    "pattern": "^[0-9]{0,10}$"
                },
                "amount": {
                    "type": "number",
                    "pattern": "^[0-9]{0,14}$"
                },
                "note": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z ]{0,35}$"
                },
                "pre-approved": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,1}$"
                },
                "merchant-name": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z ]{0,50}$"
                },
                "payee-name": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z ]{0,50}$"
                },
                "payer-mcc": {
                    "type": "number",
                    "pattern": "^[0-9]{0,14}$"
                },
                "payer-merchant-type": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,50}$"
                },
                "ref-id": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,35}$"
                },
                "currency": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,35}$"
                },
                "ref-url": {
                    "type": "string",
                    //   "pattern":"^[0-9a-zA-Z]{0,255}$"
                },
                "mid": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,20}$"
                },
                "msid": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,255}$"
                },
                "mtid": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,255}$"
                },
                "initiation-mode": {
                    "type": "number",
                    "pattern": "^[0-9]{0,2}$"
                },
                "purpose": {
                    "type": "string"
                },
                "original-txn-id": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,35}$"
                },
                "reason-code": {
                    "type": "number",
                    "pattern": "^[0-9]{0,2}$"
                },
                "ifsc": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,12}$"
                },
                "use-default-acc": {
                    "type": "string",
                    "pattern": "^[a-zA-Z]{1}$"
                }
            },
            "required": [
                "device-id",
                "mobile",
                "seq-no",
                "channel-code",
                // "merchant-account-number",
                "merchant-va",
                // "payee-va",
                "profile-id",
                "amount",
                "note",
                "pre-approved",
                "merchant-name",
                // "payee-name",
                // "payer-mcc",
                // "payer-merchant-type",
                // "ref-id",
                // "currency",
                // "ref-url",
                // "mid",
                // "msid",
                // "mtid",
                // "initiation-mode",
                // "purpose",
                "original-txn-id",
                "reason-code",
                "use-default-acc"
            ]
        };
    } else if (proxyPathSuffix === "/GetUpiLiteDetails" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object",
            "properties": {
                "channel-code": {
                    "type": "string",
                    "pattern": "^[a-zA-Z]{0,15}$"
                },
                "device-id": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z-]{0,255}$"
                },
                "mobile": {
                    "type": "string",
                    "pattern": "^[0-9]{0,10}$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,35}$"
                },
                "account-number": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,50}$"
                },
                "Os": {
                    "type": "string",
                    "pattern": "^[0-9a-zA-Z]{0,20}$"
                },
                "app-id": {
                    "type": "string"
                },
                "profile-id": {
                    "type": "string",
                    "pattern": "^[0-9]{0,10}$"
                },
                "required": [
                    "device-id",
                    "mobile",
                    "seq-no",
                    "channel-code",
                ]
            }
        };
    } else if (proxyPathSuffix === "/CheckStatus" && request_verb == "POST") {
       schema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "channel-code": {
      "type": "string",
	  "pattern": "^[a-zA-Z]{0,20}$"
    },
    "device-id": {
      "type": "string",
	  "pattern": "^[0-9a-zA-Z]{0,20}$"
    },
    "mobile": {
      "type": "string",
	  "pattern": "^[0-9]{0,10}$"
    },
    "orig-seq-no": {
      "type": "string",
	  "pattern": "^[0-9a-zA-Z]{0,35}$"
    },
    "profile-id": {
      "type": "string",
	  "pattern": "^[0-9a-zA-Z]{0,100}$"
    },
    "ref-id": {
      "type": "string",
	  "pattern": "^[0-9a-zA-Z]{0,35}$"
    },
    "rrn": {
      "type": "string",
	  "pattern": "^[0-9]{0,20}$"
    },
    "seq-no": {
      "type": "string",
	  "pattern": "^[0-9a-zA-Z]{0,35}$"
    },
    "txn-date": {
      "type": "string"
    }
  },
  "required": [
    "channel-code",
    "device-id",
    // "Mobile",
    "profile-id",
    "seq-no",
  ]
       

        // }else if (proxyPathSuffix === "/blockunblockstatus" && request_verb == "POST") {
        //         schema = {
        //   "$schema": "http://json-schema.org/draft-04/schema#",
        //   "type": "object",
        //   "properties": {
        //     "Mobile": {
        //       "type": "string",
        //       "pattern": "^[0-9]{0,10}$"
        //     },
        //     "Block_Type": {
        //       "type": "string",
        //       "pattern": "^[0-9a-zA-Z _]{0,20}$"
        //     },
        //     "Block_Value": {
        //       "type": "string",
        //       "pattern": "^[0-9a-zA-Z ,]{0,999}$"
        //     },
        //     "Seq_No": {
        //       "type": "string",
        //       "pattern": "^[0-9a-zA-Z]{0,35}$"
        //     },
        //     "Channel_Code": {
        //       "type": "string",
        //       "pattern": "^[a-zA-Z]{0,20}$"
        //     },
        //     "Device_Id": {
        //       "type": "string",
        //       "pattern": "^[0-9a-zA-Z]{0,35}$"
        //     }
        //   },
        //   "required": [
        //     // "Mobile",
        //     "Block_Type",
        //     "Block_Value",
        //     "Seq_No",
        //     "Channel_Code",
        //     "Device_Id"
        //   ]
        // };
       };
    } else if (proxyPathSuffix === "/InitiateMandatePay" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                // "type": {
                //   "type": "string"
                // },
                "device-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-]{0,50}$|^$"
                },
                "mobile": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,25}$|^$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "channel-code": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,15}$|^$"
                },
                "profile-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,20}$|^$"
                },
                "account-provider": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,10}$|^$"
                },
                "purpose": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,2}$|^$"
                },
                "initiation-mode": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9]{0,2}$|^$"
                },
                "payer-va": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-._@]{0,255}$"
                },
                "payee-va": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-._@]{0,255}$"
                },
                "account-number": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,40}$|^$"
                },
                "ifsc": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,11}$|^$"
                },
                "account-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,20}$|^$"
                },
                "amount": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z .]{0,20}$|^$"
                },
                "note": {
                    "type": "string",
                      "pattern":"^(?!.*--)[0-9a-zA-Z ]{0,50}$|^$"
                },
                "umn": {
                    "type": "string",
                      "pattern":"^(?!.*--)[0-9a-zA-Z @]{0,70}$|^$"
                },
                "retry-count": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,2}$|^$"
                },
                "mandate-seq-number": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,7}$|^$"
                },
                "mandate-signature": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,255}$|^$"
                },
                "lrn": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,100}$|^$"
                },
                "arqc": {
                    "type": "string"
                }
            },
            "required": [
                // "type",
                "device-id",
                "mobile",
                "seq-no",
                // "channel-code",
                "profile-id",
                "account-provider",
                "purpose",
                "initiation-mode",
                "payer-va",
                "payee-va",
                "account-number",
                "ifsc",
                "account-type",
                "amount",
                "note",
                "umn",
                "retry-count",
                "mandate-seq-number",
                // "mandate-signature"
                // "lrn",
                // "arqc"
            ]
        }
    } else if (proxyPathSuffix === "/ManageDelegateUser" && request_verb == "POST") {
        schema = {

            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "device-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-]{0,50}$|^$"
                },
                "mobile": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,25}$|^$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "channel-code": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,15}$|^$"
                },
                "ifsc": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,11}$|^$"
                },
                "payer-va": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-._@]{0,255}$"
                },
                "payee-va": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-._@]{0,255}$"
                },
                "profile-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,20}$|^$"
                },
                "note": {
                    "type": "string"
                },
                "payer-name": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z ,.()]{0,50}$|^$"
                },
                "payee-name": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z ,.]{0,50}$|^$"
                },
                "purpose": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,4}$|^$"
                },
                "action": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,10}$|^$"
                },
                "initiated-by": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,50}$|^$"
                },
                "link-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,50}$|^$"
                },
                "link-value": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,25}$|^$"
                },
                "delegation-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,50}$|^$"
                },
                "account-number": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,50}$|^$"
                },
                "org-txn-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                }
            },
            "required": [
                "device-id",
                "mobile",
                "seq-no",
                "channel-code",
                // "ifsc",
                "payer-va",
                "payee-va",
                "profile-id",
                "note",
                "payer-name",
                "payee-name",
                "purpose",
                "action",
                "initiated-by",
                "link-type",
                "link-value",
                "delegation-type",
                // "account-number",
                "org-txn-id"
            ]
        }
    } else if (proxyPathSuffix === "/DelegateAuth" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "channel-code": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,15}$|^$"
                },
                "device-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-]{0,50}$|^$"
                },
                "mobile": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,25}$|^$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "payer-va": {
                    "type": "string",
                    // "pattern": "^(?!.*--)[0-9a-zA-Z-._@]{0,255}$"
                },
                "payee-va": {
                    "type": "string",
                    // "pattern": "^(?!.*--)[0-9a-zA-Z-._@]{0,255}$"
                },
                "profile-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,20}$|^$"
                },
                "note": {
                    "type": "string"
                },
                "payer-name": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z ,.()]{0,50}$|^$"
                },
                "payee-name": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z ,.()]{0,50}$|^$"
                },
                "action": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,10}$|^$"
                },
                "link-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,50}$|^$"
                },
                "link-value": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,10}$|^$"
                },
                "upi-tranlog-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "org-txn-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "delegation-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,50}$|^$"
                }
            },
            "required": [
                "channel-code",
                "device-id",
                "mobile",
                "seq-no",
                "payer-va",
                "payee-va",
                "profile-id",
                "note",
                "payer-name",
                // "payee-name",
                "action",
                "link-type",
                "link-value",
                "upi-tranlog-id",
                "org-txn-id"
            ]
        }
    } else if (proxyPathSuffix === "/ValidateDelegateAUTH" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "channel-code": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,15}$|^$"
                },
                "device-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-]{0,50}$|^$"
                },
                "mobile": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,25}$|^$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "payer-va": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-_.@]{0,50}$|^$"
                },
                "payee-va": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-_.@]{0,50}$|^$"
                },
                "profile-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,50}$|^$"
                },
                "note": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z ]{0,50}$|^$"
                },
                "payer-name": {
                    "type": "string",
                     "pattern": "^(?!.*--)[0-9a-zA-Z ]{0,50}$|^$"
                },
                "payee-name": {
                    "type": "string",
                     "pattern": "^(?!.*--)[0-9a-zA-Z ]{0,50}$|^$"
                },
                "purpose": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,4}$|^$"
                },
                "payee-mcc": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,4}$|^$"
                },
                "primary-payer-va": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-_.@]{0,50}$|^$"
                },
                "pre-approved": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,1}$|^$"
                },
                "amount": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z .]{0,50}$|^$"
                },
                "primary-payer-name": {
                    "type": "string",
                     "pattern": "^(?!.*--)[0-9a-zA-Z ]{0,50}$|^$"
                },
                "payee-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,50}$|^$"
                },
                "delegation-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,10}$|^$"
                },
                "org-txn-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9]{0,35}$|^$"
                },
                "feature": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9]{0,20}$|^$"
                },
                "umn": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9\/\|\%\$_@,.-]{0,35}$|^$"
                },
                "initiation-mode": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9]{0,2}$|^$"
                },
                "geocode": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9 ,.-]{0,50}$|^$"
                },
                "location": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9 ,]{0,40}$|^$"
                },
                "ip": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9 :.]{0,50}$|^$"
                },
                "device-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9]{0,20}$|^$"
                },
                "os": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9]{0,20}$|^$"
                },
                "app-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9 .]{0,50}$|^$"
                },
                "capability": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9]{0,99}$|^$"
                },
                "telecom": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,99}$|^$"
                },
                "ref-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9 ,.-]{0,99}$|^$"
                }
                
            },
            "required": [
                "channel-code",
                "device-id",
                "mobile",
                "seq-no",
                "payer-va",
                "payee-va",
                "profile-id",
                "note",
                "payer-name",
                "payee-name",
                "purpose",
                "payee-mcc",
                "primary-payer-va",
                // "pre-approved",
                "amount",
                "primary-payer-name",
                "payee-type",
                "delegation-type",
                "org-txn-id"
            ]
        }
    } else if (proxyPathSuffix === "/AddSecondaryVpa" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "device-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-]{0,50}$|^$"
                },
                "mobile": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,25}$|^$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "channel-code": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,15}$|^$"
                },
                "virtual-address": {
                    "type": "string",
                    // "pattern": "^(?!.*--)[a-zA-Z @]{0,50}$|^$"
                },
                "name": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z ,.()]{0,50}$|^$"
                },
                "purpose": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,2}$|^$"
                },
                "location": {
                    "type": "string",
                      "pattern": "^(?!.*--)[0-9a-zA-Z ,.()]{0,40}$|^$"
                },
                "ip": {
                    "type": "string"
                },
                "device-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,20}$|^$"
                },
                "geocode": {
                    "type": "string",
                    // "pattern": "^(?!.*--)[0-9a-zA-Z.]{0,20}$"
                },
                "os": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,20}$|^$"
                },
                " app-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z .]{1,20}$"
                }
            },
            "required": [
                "device-id",
                "mobile",
                "seq-no",
                "channel-code",
                "virtual-address",
                "name",
                "purpose",
                // "location",
                "ip",
                "device-type",
                // "geocode",
                "os",
                "app-id"
            ]
        }
    } else if (proxyPathSuffix === "/ApproveDelegateAUTH" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "mobile": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,25}$|^$"
                },
                "payer-va": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-_.@]{0,255}$"
                },
                "payee-va": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-._@]{0,255}$"
                },
                "amount": {
                    "type": "string",
                 "pattern": "^(?!.*--)[0-9a-zA-Z .]{0,50}$|^$"
                },
                "note": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z ]{0,50}$|^$"
                },
                "device-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-]{0,50}$|^$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "channel-code": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,15}$|^$"
                },
                "profile-id": {
                    "type": "string",
                   "pattern": "^(?!.*--)[0-9a-zA-Z]{0,50}$|^$"
                },
                "account-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,20}$|^$"
                },
                "ifsc": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,11}$|^$"
                },
                "upi-tranlog-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "action": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,1}$|^$"
                },
                "account-number": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,50}$|^$"
                },
                "default-credit": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,1}$|^$"
                },
                "default-debit": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,1}$|^$"
                },
                "payee-name": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z ]{0,50}$|^$"
                },
                "txn-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,50}$|^$"
                },
                "use-default-acc": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,1}$|^$"
                },
                "mcc": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,4}$|^$"
                },
                "payee-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,50}$|^$"
                },
                "purpose": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,4}$|^$"
                },
                "org-txn-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "payer-name": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z ]{0,50}$|^$"
                },
                "secondary-payer-va": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-_.@]{0,50}$|^$"
                },
                "mpin": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z\/\|\%\$_@,.-]{0,1024}$|^$"
                },
                "secondary-payer-name": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z ]{0,50}$|^$"
                },
                "geocode": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9 ,.-]{0,50}$|^$"
                },
                "location": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9 ,]{0,40}$|^$"
                },
                "ip": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9 :.]{0,50}$|^$"
                },
                "device-type": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9]{0,20}$|^$"
                },
                "os": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9]{0,20}$|^$"
                },
                "app-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9.]{0,50}$|^$"
                },
                "capability": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9]{0,99}$|^$"
                },
                "telecom": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,99}$|^$"
                },
                "ref-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9 ,.-]{0,99}$|^$"
                },
                "account-provider": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z0-9]{0,10}$|^$"
                }
            },
            "required": [
                "mobile",
                "payer-va",
                "payee-va",
                "amount",
                "note",
                "device-id",
                "seq-no",
                "channel-code",
                "profile-id",
                "account-type",
                "ifsc",
                "upi-tranlog-id",
                "action",
                "account-number",
                "default-credit",
                "default-debit",
                "payee-name",
                "txn-type",
                "use-default-acc",
                // "mcc",
                "payee-type",
                "purpose",
                "org-txn-id",
                "payer-name",
                "secondary-payer-va",
                "mpin",
                "secondary-payer-name",
                "account-provider"
            ]
        }
    } else if (proxyPathSuffix === "/GetLinkDelegateDetails" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "device-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z-]{0,50}$|^$"
                },
                "mobile": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,25}$|^$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "channel-code": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,15}$|^$"
                },
                "profile-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,50}$|^$"
                },
                "purpose": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,2}$|^$"
                },
                "app-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z .]{1,20}$"
                },
                "initiated-by": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                }
            },
            "required": [
                "device-id",
                "mobile",
                "seq-no",
                "channel-code",
                "profile-id",
                "purpose",
                "app-id",
                "initiated-by"
            ]
        }
    } else if (proxyPathSuffix === "/GetPendingDelegatePayments" && request_verb == "POST") {
        schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "device-id": {
                    "type": "string",
                    "pattern": "^(?!.*?--)[0-9a-zA-Z-]{0,50}$|^$"
                },
                "mobile": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,25}$|^$"
                },
                "seq-no": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$|^$"
                },
                "channel-code": {
                    "type": "string",
                    "pattern": "^(?!.*--)[a-zA-Z]{0,15}$|^$"
                },
                "profile-id": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,50}$|^$"
                },
                "purpose": {
                    "type": "string",
                    "pattern": "^(?!.*--)[0-9a-zA-Z]{0,2}$|^$"
                },
                "virtual-address": {
                    "type": "string"
                }
            },
            "required": [
                "device-id",
                "mobile",
                "seq-no",
                "channel-code",
                "profile-id",
                "purpose",
                "virtual-address"
            ]
        }
    }
    
    // new suffix schema started 
    // APIGW-25134,APIGW-25461,APIGW-23451
    else if(proxyPathSuffix === "/ReqCCBill" && request_verb == "POST"){
        schema = {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "mobile": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z]{0,25}$"
            },
            "seq-no": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z]{0,35}$"
            },
            "channel-code": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,15}$"
            },
            "device-id": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9\-]{0,50}$"
            },
            "initiated-by": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,20}$"
            },
            "bank-name": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9 ]{0,50}$"
            },
            "payer-va": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9\-.@]{0,255}$"
            },
            "payer-account": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9]{0,50}$"
            },
            "payer-ifsc": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9]{0,11}$"
            },
            "sub-type": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,20}$"
            }
            ,
             "device-type":{
                "type":"string",
                "pattern": "^[a-zA-Z0-9]{0,20}$"
            },
             "os":{
                "type":"string",
                "pattern": "^[a-zA-Z0-9]{1,20}$"
            },
             "app-id":{
                "type":"string",
                "pattern": "^[a-zA-Z0-9.]{1,20}$"
            },
             "capability":{
                "type":"string",
                "pattern": "^[a-zA-Z0-9]{1,99}$"
            },
            "geocode":{
                "type":"string",
                "pattern": "^[a-zA-Z0-9 -.,]{0,255}$"
            },
            "location":{
                "type":"string",
                "pattern": "^[a-zA-Z0-9,]{0,40}$"
            },
            "ip":{
                "type":"string",
                "pattern": "^[a-zA-Z0-9.:]{0,99}$"
            }
          },
          "required": [
            "mobile",
            "seq-no",
            "channel-code",
            "device-id",
            "initiated-by",
            "payer-va",
            "payer-ifsc",
            "sub-type",
            "ip",
            "os",
            "device-type",
            "app-id",
            "capability",
            // "geocode",
            // "location"
          ]
        };
    }
    // tested OK
    else if(proxyPathSuffix === "/BlockUnblockChannels" && request_verb == "POST"){
        schema = {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "seq-no": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z]{0,35}$"
            },
            "channel-code": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,15}$"
            },
            "start-time": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z \/:]{0,40}$"
            },
            "channel-action": {
              "type": "string",
              "pattern": "^[a-zA-Z]{1,1}$"
            },
            "end-time": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z \/:]{0,40}$"
            }
          },
          "required": [
            "seq-no",
            "channel-code",
            "channel-action",
          ]
        };
    }
    // tested OK
    else if(proxyPathSuffix === "/ManageEMI"){
        schema = {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "Generated schema for Root",
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "amount": {
                  "type": "string",
                  "pattern": "^[0-9.]{0,14}$"
                },
                "org-txn-id": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,35}$"
                },
                "mobile": {
                  "type": "string",
                  "pattern": "^[0-9]{0,25}$"
                },
                "payee-va": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z.\-@]{0,255}$"
                },
                "account-number": {
                  "type": "string",
                //   "pattern": "^[0-9a-zA-Z]{0,20}$"
                  "pattern": "^[0-9a-zA-Z]{0,50}$"
                },
                "payee-name": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,50}$"
                },
                "device-id": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z\-]{0,50}$"
                },
                "seq-no": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,35}$"
                },
                "channel-code": {
                  "type": "string",
                  "pattern": "^[a-zA-Z]{0,15}$"
                },
                "account-type": {
                  "type": "string",
                  "pattern": "^[a-zA-Z]{0,20}$"
                },
                "profile-id": {
                  "type": "string",
                  "pattern": "^[0-9]{0,10}$"
                },
                "action": {
                  "type": "string",
                  "pattern": "^[a-zA-Z]{0,10}$"
                },
                "payee-mcc": {
                  "type": "string",
                  "pattern": "^[0-9]{0,4}$"
                },
                "ifsc": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,11}$"
                },
                "payer-va": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z.\-@]{0,255}$"
                },
                "status": {
                  "type": "string",
                  "pattern": "^[a-zA-Z]{0,10}$"
                },
                "org-check-txn-id":{
                    "type":"string",
                    "pattern": "^[a-zA-Z0-9]{0,35}$"
                },
                "sub-action":{
                    "type":"string",
                    "pattern": "^[a-zA-Z0-9]{0,10}$"
                },
                "emi-seq-no":{
                    "type":"string",
                    "pattern": "^[a-zA-Z0-9]{0,35}$"
                },
                "tenure":{
                    "type":"string",
                    "pattern": "^[0-9]{0,10}$"
                },
                "offer-id":{
                    "type":"string",
                    "pattern": "^[0-9]{0,50}$"
                },
                "start-date":{
                    "type":"string",
                    "pattern": "^[0-9]{0,10}$"
                },
                "end-date":{
                    "type":"string",
                    "pattern": "^[0-9]{0,10}$"
                },
                "emi-amount":{
                    "type":"string",
                    "pattern": "^[0-9.]{0,14}$"
                },
                "interest-rate":{
                    "type":"string",
                    "pattern": "^[0-9%.]{0,10}$"
                },
                "interest-amount":{
                    "type":"string",
                    "pattern": "^[0-9.]{0,14}$"
                },
                "total-amount":{
                    "type":"string",
                     "pattern": "^[0-9.]{0,14}$"
                },
                "discount-amount":{
                    "type":"string",
                     "pattern": "^[0-9.]{0,14}$"
                },
                "processing-fee":{
                    "type":"string",
                     "pattern": "^[0-9.]{0,14}$"
                },
                "mpin":{
                    "type":"string"
                },
                 "device-type":{
                    "type":"string",
                    "pattern": "^[a-zA-Z0-9]{0,20}$"
                },
                 "os":{
                    "type":"string",
                    "pattern": "^[a-zA-Z0-9]{0,20}$"
                },
                 "app-id":{
                    "type":"string",
                    "pattern": "^[a-zA-Z0-9.]{0,20}$"
                },
                 "capability":{
                    "type":"string",
                    "pattern": "^[a-zA-Z0-9]{0,99}$"
                },
                "geocode":{
                    "type":"string",
                    "pattern": "^[a-zA-Z0-9 -.,]{0,255}$"
                },
                "location":{
                    "type":"string",
                    "pattern": "^[a-zA-Z0-9,]{0,40}$"
                },
                "ip":{
                    "type":"string",
                    "pattern": "^[a-zA-Z0-9.:]{0,99}$"
                }
                
                
              },
              "required": [
                "amount",
                // "org-txn-id",
                "mobile",
                "payee-va",
                "account-number",
                "payee-name",
                "device-id",
                "seq-no",
                "channel-code",
                "account-type",
                "profile-id",
                "action",
                "payee-mcc",
                "ifsc",
                "payer-va",
                "status",
                "ip",
                "os",
                "device-type",
                "app-id",
                "capability",
                // "geocode",
                // "location",
                // "mpin"
              ]
        };
    }
    // APIGW-25134,APIGW-25461,APIGW-23451
    
     else if(proxyPathSuffix === "/RequestValidateCustomer"){
        schema = {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "mobile": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9]{0,25}$"
            },
            "device-id": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z-]{0,35}$"
            },
            "seq-no": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$"
            },
            "channel-code": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z]{0,15}$"
            },
            "profile-id": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9]{0,10}$"
            },
            "ref-id": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9]{0,12}$"
            },
            "initiation-mode": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9]{0,2}$"
            },
            "org-txn-id": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$"
            },
            "ref-url": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z.:\/]{0,255}$"
            },
            "qr-ver": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9]{0,15}$"
            },
            "qr-medium": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z]{0,2}$"
            },
            "stan": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9]{0,6}$"
            },
            "qr-expire-ts": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9]{0,14}$"
            },
            "payer-va": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z.-@]{0,255}$"
            },
            "payer-type": {
              "type": "string",
              "pattern": "^(?!.*--)[a-zA-Z]{0,50}$"
            },
            "payer-code": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9]{0,4}$"
            },
            "payer-name": {
              "type": "string",
              "pattern": "^(?!.*--)[a-zA-Z]{0,100}$"
            },
            "payer-account-type": {
              "type": "string",
              "pattern": "^(?!.*--)[a-zA-Z]{0,20}$"
            },
            "payer-ifsc": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z]{0,11}$"
            },
            "payer-account-number": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z]{0,20}$"
            },
            "msid": {
              "type": "string",
               "pattern": "^[0-9]{0,20}$"
            },
            "mtid": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z]{0,20}$"
            },
            "mid": {
              "type": "string",
              "pattern": "^[0-9]{0,20}$"
            },
            "brand": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z]{0,99}$"
            },
            "legal": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z]{0,99}$"
            },
            "franchise": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z]{0,16}$"
            },
            "sub-code": {
              "type": "string",
              "pattern": "^[0-9]{0,4}$"
            },
            "merchant-loc": {
              "type": "string",
              "pattern": "^[0-9]{0,10}$"
            },
            "note": {
              "type": "string",
               "pattern": "^[0-9a-zA-Z]{0,50}$"
            },
            "basis-on": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,10}$"
            },
            "geocode": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z ,.-]{0,16}$"
            },
            "tn": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z]{0,50}$"
            },
            "payee-va": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z-.@]{0,255}$"
            },
            "payee-name": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,100}$"
            },
            "payee-mcc": {
              "type": "string",
              "pattern": "^[0-9]{0,4}$"
            },
            "payee-account": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z]{0,20}$"
            },
            "payee-ifsc": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z]{0,11}$"
            },
            "purpose-code": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9]{0,2}$"
            },
            "app": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z.]{0,20}$"
            },
            "os": {
              "type": "string",
               "pattern": "^(?!.*--)[0-9a-zA-Z]{0,20}$"
            },
            "device-type": {
              "type": "string",
               "pattern": "^(?!.*--)[0-9a-zA-Z]{0,20}$"
            },
            "capability": {
              "type": "string",
               "pattern": "^(?!.*--)[0-9a-zA-Z]{0,99}$"
            },
            "telecom": {
              "type": "string",
               "pattern": "^(?!.*--)[a-zA-Z]{0,99}$"
            },
            "ip": {
              "type": "string",
              "pattern": "^(?!.*--)[0-9a-zA-Z.:]{0,50}$"
            }
          },
              "required": [
                "mobile",
                "device-id",
                "seq-no",
                "channel-code",
                "profile-id",
                "ref-id",
                "initiation-mode",
                "org-txn-id",
                // "ref-url",
                // "qr-ver",
                // "qr-medium",
                "stan",
                "qr-expire-ts",
                "payer-va",
                // "payer-type",
                // "payer-code",
                "payer-name",
                // "payer-account-type",
                // "payer-ifsc",
                "payer-account-number",
                "msid",
                "mtid",
                "mid",
                "brand",
                "legal",
                "franchise",
                // "sub-code",
                "merchant-loc",
                "note",
                "basis-on",
                // "geocode",
                "tn",
                // "payee-va",
                // "payee-name",
                // "payee-mcc",
                // "payee-account",
                // "payee-ifsc",
                "purpose-code",
                "app",
                "os",
                "device-type",
                "capability",
                // "telecom",
                // "ip"
              ]
};
}
     else if(proxyPathSuffix === "/BalanceInquiryCDM"){
            schema = {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "type": "object",
              "properties": {
                "mobile": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9]{0,25}$"
                },
                "device-id": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z-]{0,35}$"
                },
                "seq-no": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$"
                },
                "channel-code": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z]{0,15}$"
                },
                // "account-provider": {
                //   "type": "string",
                //   "pattern": "^(?!.*--)[0-9]{0,20}$"
                // },
                "payer-va": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z.-@]{0,255}$"
                },
                "profile-id": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9]{0,10}$"
                },
                "payer-code": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9]{0,4}$"
                },
                "payer-account-type": {
                  "type": "string",
                  "pattern": "^(?!.*--)[a-zA-Z]{0,20}$"
                },
                "payer-ifsc": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,11}$"
                },
                "payer-account-number": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,20}$"
                },
                "mpin": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z-._@]{0,1024}$"
                },
                "ref-id": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9]{0,12}$"
                },
                "initiation-mode": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9]{0,2}$"
                },
                "org-txn-id": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z]{0,35}$"
                },
                "note": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,50}$"
                },
                "ref-url": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z.:\/]{0,255}$"
                },
                "qr-ver": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9]{0,15}$"
                },
                "qr-medium": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z]{0,2}$"
                },
                "stan": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9]{0,6}$"
                },
                "qr-expire-ts": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9]{0,14}$"
                },
                "purpose-code": {
                  "type": "string",
                   "pattern": "^(?!.*--)[0-9]{0,2}$"
                },
                "msid": {
                  "type": "string",
                  "pattern": "^[0-9]{0,20}$"
                },
                "mtid": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,20}$"
                },
                "mid": {
                  "type": "string",
                  "pattern": "^[0-9]{0,20}$"
                },
                "brand": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,99}$"
                },
                "legal": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,99}$"
                },
                "franchise": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z]{0,16}$"
                },
                "sub-code": {
                  "type": "string",
                  "pattern": "^[0-9]{0,4}$"
                },
                "merchant-loc": {
                  "type": "string",
                  "pattern": "^[0-9]{0,10}$"
                },
                "geocode": {
                  "type": "string",
                  "pattern": "^[0-9a-zA-Z ,.-]{0,16}$"
                },
                "app": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z.]{0,20}$"
                },
                "os": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z]{0,20}$"
                },
                "device-type": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z]{0,20}$"
                },
                "capability": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z]{0,99}$"
                },
                "telecom": {
                  "type": "string",
                  "pattern": "^(?!.*--)[a-zA-Z]{0,99}$"
                },
                "ip": {
                  "type": "string",
                  "pattern": "^(?!.*--)[0-9a-zA-Z.:]{0,50}$"
                }
              },
              "required": [
                "mobile",
                "device-id",
                "seq-no",
                "channel-code",
                // "account-provider",
                "payer-va",
                "profile-id",
                // "payer-code",
                // "payer-account-type",
                // "payer-ifsc",
                "payer-account-number",
                "mpin",
                "ref-id",
                "initiation-mode",
                "org-txn-id",
                "note",
                // "ref-url",
                // "qr-ver",
                // "qr-medium",
                "stan",
                "qr-expire-ts",
                "purpose-code",
                "msid",
                "mtid",
                "mid",
                "brand",
                "legal",
                "franchise",
                // "sub-code",
                "merchant-loc",
                // "geocode",
                "app",
                "os",
                "device-type",
                "capability",
                // "telecom",
                "ip"
              ]
    };
    }
    // tested OK
        // new suffix schema ended 
    
    // APIGW-27309 APIGW-27515 schema developement
    else if(proxyPathSuffix === "/GetServerSSCLToken"){
        schema = {
              "$schema": "http://json-schema.org/draft-04/schema#",
              "type": "object",
              "additionalProperties": false,
              "properties": {
                "mobile": {
                  "type": "string",
                  "pattern": "^[0-9]{0,25}$"
                },
                "device-id": {
                  "type": "string",
                  "pattern": "^[a-zA-Z0-9\-]{0,50}$"
                },
                "deviceType": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9]{0,20}$"
            },
                "seq-no": {
                  "type": "string",
                  "pattern": "^[a-zA-Z0-9]{0,35}$"
                },
                "channel-code": {
                  "type": "string",
                  "pattern": "^[a-zA-Z]{0,15}$"
                },
                "app-id": {
                  "type": "string",
                  "pattern": "^[a-zA-Z0-9.]{0,255}$"
                },
                "sub-type": {
                  "type": "string",
                  "pattern": "^[a-zA-Z0-9]{0,20}$"
                },
                "txn-type": {
                  "type": "string",
                  "pattern": "^[a-zA-Z]{0,20}$"
                },
                "note": {
                  "type": "string",
                  "pattern": "^(.*?)[a-zA-Z0-9]{0,50}$"
                },
                "cred-value": {
                  "type": "string",
                  "pattern": "^[a-zA-Z0-9\| = /\+,]{0,255}$"
                },
                "random": {
                  "type": "string",
                  "pattern": "^(.*?)[a-zA-Z0-9]{0,255}$"
                },
                "txn-id": {
                  "type": "string",
                  "pattern": "^[a-zA-Z0-9]{0,35}$"
                }
              },
              "required": [
                "mobile",
                "device-id",
                "seq-no",
                "channel-code",
                "app-id",
                // "sub-type",
                "txn-type",
                "note",
                // "cred-value",
                // "random",
                // "txn-id"
              ]
            };
    }
    else if(proxyPathSuffix === "/SetUserSsclCred"){
    schema = {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "note": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,50}$"
            },
            "payee-type": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,50}$"
            },
            "encrypted-pin": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,1024}$"
            },
            "payee-code": {
              "type": "string",
              "pattern": "^[0-9]{0,4}$"
            },
            "pin-cred": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,1024}$"
            },
            "pin-cred-length": {
              "type": "string",
              "pattern": "^[0-9]{0,4}$"
            },
            "aadhaar-otp-cred": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,1024}$"
            },
            "aadhaar-otp-cred-length": {
              "type": "string",
              "pattern": "^[0-9]{0,6}$"
            },
            "newpin-cred": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,1024}$"
            },
            "newpin-cred-length": {
              "type": "string",
              "pattern": "^[0-9]{0,4}$"
            },
            "sms-otp-cred": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,1024}$"
            },
            "sms-otp-cred-length": {
              "type": "string",
              "pattern": "^[0-9]{0,4}$"
            },
            "atm-otp-cred": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,1024}$"
            },
            "atm-pin-cred-length": {
              "type": "string",
               "pattern": "^[0-9]{0,4}$"
            },
            "sub-type": {
              "type": "string"
            },
            "payer-name": {
              "type": "string",
               "pattern": "^[a-zA-Z]{0,50}$"
            },
            "device-id": {
              "type": "string",
               "pattern": "^[a-zA-Z0-9-]{0,50}$"
            },
            "xml-payload": {
              "type": "string",
               "pattern": "^(.*?)[a-zA-Z0-9]{0,255}$"
            },
            "capability": {
              "type": "string",
               "pattern": "^[a-zA-Z0-9]{0,100}$"
            },
            "ref-id": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,99}$"
            },
            "channel-code": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,15}$"
            },
            "message-type": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9]{0,50}$"
            },
            "source-type": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,50}$"
            },
            "deviceType": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9]{0,20}$"
            },
            "telecom": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,100}$"
            },
            "payer-va": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9 _@.-]{0,255}$"
            },
            "app": {
              "type": "string",
            },
            "txn-id": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,35}$"
            },
            "txn-code": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,20}$"
            },
            "payer-code": {
              "type": "string",
              "pattern": "^[0-9]{0,4}$"
            },
            "hmac-cred-value": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,1024}$",
            },
            "amount": {
              "type": "string",
              "pattern": "^[0-9.]{0,14}$"
            },
            "app-id": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z.]{0,255}$"
            },
            "os": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9]{0,100}$"
            },
            "ref-url": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9.\:\/]{0,255}$"
            },
            "ip": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z.]{0,100}$"
            },
            "mobile": {
              "type": "string",
              "pattern": "^[0-9]{0,25}$"
            },
            "payee-va": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9 _@.-]{0,255}$"
            },
            "payee-name": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9]{0,100}$"
            },
            "seq-no": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9]{0,35}$"
            },
            "geocode": {
              "type": "string",
              "pattern": "^[0-9a-zA-Z.]{0,100}$"
            },
            "location": {
              "type": "string",
              "pattern": "^[a-zA-Z]{0,100}$"
            },
            "apiType": {
              "type": "string",
            },
            "payer-type": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9]{0,50}$"
            },
            "mobRegFormat": {
              "type": "string"
            },
            "random": {
              "type": "string",
              "pattern": "^(.*?)[a-zA-Z0-9]{0,255}$"
            }
          },
          "required": [
            "note",
            // "payee-type",
            "encrypted-pin",
            // "payee-code",
            "pin-cred",
            "pin-cred-length",
            // "aadhaar-otp-cred",
            // "aadhaar-otp-cred-length",
            // "newpin-cred",
            // "newpin-cred-length",
            // "sms-otp-cred",
            // "sms-otp-cred-length",
            // "atm-otp-cred",
            // "atm-pin-cred-length",
            // "sub-type",
            "payer-name",
            "device-id",
            "xml-payload",
            // "capability",
            // "ref-id",
            "channel-code",
            "message-type",
            "source-type",
            // "device-type",
            // "telecom",
            "payer-va",
            // "app",
            // "txn-id",
            // "txn-code",
            // "payer-code",
            // "hmac-cred-value",
            // "amount",
            "app-id",
            // "os",
            // "ref-url",
            // "ip",
            "mobile",
            // "payee-va",
            // "payee-name",
            "seq-no",
            // "geocode",
            // "location",
            // "apiType",
            // "payer-type",
            // "mobRegFormat",
            "random"
          ]
        };
    }
    
    // APIGW-31421 , APIGW-31438
    // else if(proxyPathSuffix === "/BlockUnblockVPA"){
    //     schema = {
    //       "$schema": "http://json-schema.org/draft-04/schema#",
    //       "type": "object",
    //       "properties": {
    //         "channel-code": {
    //           "type": "string"
    //         },
    //         "device-id": {
    //           "type": "string"
    //         },
    //         "mobile": {
    //           "type": "integer"
    //         },
    //         "seq-no": {
    //           "type": "string"
    //         },
    //         "vpa": {
    //           "type": "string"
    //         },
    //         "block-vpa": {
    //           "type": "string"
    //         },
    //         "profile-id": {
    //           "type": "integer"
    //         },
    //         "block-days": {
    //           "type": "string"
    //         },
    //         "block-txn-type": {
    //           "type": "string"
    //         },
    //         "block-type": {
    //           "type": "string"
    //         },
    //         "block-value ": {
    //           "type": "string"
    //         },
    //         "app-id": {
    //           "type": "string"
    //         },
    //         "capability": {
    //           "type": "string"
    //         },
    //         "device-type": {
    //           "type": "string"
    //         },
    //         "ip": {
    //           "type": "string"
    //         },
    //         "os": {
    //           "type": "string"
    //         },
    //         "geocode": {
    //           "type": "string"
    //         },
    //         "location": {
    //           "type": "string"
    //         },
    //         "telecom": {
    //           "type": "string"
    //         }
    //       },
    //       "required": [
    //         "channel-code",
    //         "device-id",
    //         "mobile",
    //         "seq-no",
    //         "vpa",
    //         "block-vpa",
    //         "profile-id",
    //         "block-days",
    //         "block-txn-type",
    //         "block-type",
    //         "block-value ",
    //         "app-id",
    //         "capability",
    //         "device-type",
    //         "ip",
    //         "os",
    //         "geocode",
    //         "location",
    //         "telecom"
    //       ]
    //     }
    // }
    
    // else if(proxyPathSuffix === "/BlockedVpaList"){
    //     schema = {
    //       "$schema": "http://json-schema.org/draft-04/schema#",
    //       "type": "object",
    //       "properties": {
    //         "channel-code": {
    //           "type": "string"
    //         },
    //         "device-id": {
    //           "type": "string"
    //         },
    //         "mobile": {
    //           "type": "string"
    //         },
    //         "seq-no": {
    //           "type": "string"
    //         },
    //         "profile-id": {
    //           "type": "string"
    //         },
    //         "block-txn-type": {
    //           "type": "string"
    //         },
    //         "app-id": {
    //           "type": "string"
    //         },
    //         "capability": {
    //           "type": "string"
    //         },
    //         "device-type": {
    //           "type": "string"
    //         },
    //         "ip": {
    //           "type": "string"
    //         },
    //         "os": {
    //           "type": "string"
    //         },
    //         "geocode": {
    //           "type": "string"
    //         },
    //         "location": {
    //           "type": "string"
    //         },
    //         "telecom": {
    //           "type": "string"
    //         }
    //       },
    //       "required": [
    //         "channel-code",
    //         "device-id",
    //         "mobile",
    //         "seq-no",
    //         "profile-id",
    //         "block-txn-type",
    //         "app-id",
    //         "capability",
    //         "device-type",
    //         "ip",
    //         "os",
    //         "geocode",
    //         "location",
    //         "telecom"
    //       ]
    //     }
    // }
    // APIGW-31421 , APIGW-31438
    
    //  else if(proxyPathSuffix === "/ManageActivation"){
    //     schema = {
    //       "$schema": "http://json-schema.org/draft-04/schema#",
    //       "type": "object",
    //       "additionalProperties": true,
    //       "properties": {
    //         "device-id": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9 -]{0,35}$"
    //         },
    //         "mobile": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[0-9]{0,25}$"
    //         },
    //         "seq-no": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{0,35}$"
    //         },
    //         "channel-code": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z]{0,15}$"
    //         },
    //         "profile-id": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[0-9]{0,10}$"
    //         },
    //         "account-string": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{0,40}$"
    //         },
    //         "ifsc": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{0,11}$"
    //         },
    //         "payer-va": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9 -.@]{0,255}$"
    //         },
    //         "action": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{0,10}$"
    //         },
    //         "note": {
    //           "type": "string",
    //         //   "pattern": "^(?!.*--)[a-zA-Z0-9]{0,255}$"   //all special char
    //         },
    //         "consent-name": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{0,20}$"
    //         },
    //         "consent-value": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z]{0,1}$"
    //         },
    //         "mpin": {
    //           "type": "string",
    //         //   "pattern": "^(?!.*--)[a-zA-Z]{0,1024}$"     //all special char
    //         },
    //         "bio-cred": {
    //           "type": "string",
    //         //   "pattern": "^(?!.*--)[a-zA-Z0-9]{0,1024}$"  //all special char
    //         },
    //         "start-date": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{0,10}$"
    //         },
    //         "end-date": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{0,10}$"
    //         },
    //         "purpose-code": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{0,2}$"
    //         },
    //          "geocode": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[0-9 ,.-]{0,10}$"
    //         },
    //          "location": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9 ,]{0,40}$"
    //         },
    //          "ip": {
    //           "type": "string",
    //         //   "pattern": "^(?!.*--)[a-zA-Z0-9 \:.]{0,10}$"
    //         },
    //          "device-type": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{1,20}$"
    //         },
    //         "os": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{1,20}$"
    //         },
    //         "app-id": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9 .]{1,20}$"
    //         },
    //         "capability": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{1,99}$"
    //         },
    //         "telecom": {
    //           "type": "string",
    //           "pattern": "^(?!.*--)[a-zA-Z0-9]{1,99}$"
    //         },
    //          "clVersion": {
    //           "type": "string",
    //         //   "pattern": "^(?!.*--)[a-zA-Z0-9 .]{1,50}$"
    //         },
    //         "timestamp": {
    //           "type": "string",
    //         //   "pattern": "^(?!.*--)[a-zA-Z0-9]{1,50}$"
    //         }
            
    //       },
    //       "required": [
    //         "device-id",
            // "mobile",
            // "seq-no",
            // "channel-code",
            // "profile-id",
            // "accountnumber",
            // "ifsc",
            // "payerva",
            // "action",
            // "note",
            // "consentname",
            // "consentvalue",
            // "mpin",
            // "biocred",
            // "startdate",
            // "end-date",
            // "purposecode",
            // "geocode",
            // "location",
            // "ip",
            // "devicetype",
            // "os",
            // "app",
            // "capability",
            // "telecom",
            // "timestamp"
        //   ]
        // };
    // }

    // else if(proxyPathSuffix === "/FetchActivationStatus"){
    //     schema = {
    //       "$schema": "http://json-schema.org/draft-04/schema#",
    //       "type": "object",
    //       "additionalProperties": false,
    //       "properties": {
    //         "mobile": {
    //             "type": "string",
    //             "pattern": "^(?!.*--)[0-9]{0,25}$"
    //         },
    //         "device-id": {
    //             "type": "string",
    //             "pattern": "^(?!.*--)[a-zA-Z0-9\-]{0,35}$"
    //         },
    //         "seq-no": {
    //             "type": "string",
    //             "pattern": "^(?!.*--)[a-zA-Z0-9]{0,35}$"
    //         },
    //         "channel-code": {
    //             "type": "string",
    //             "pattern": "^(?!.*--)[a-zA-Z]{0,35}$"
    //         },
    //         "profile-id": {
    //             "type": "string",
    //             "pattern": "^(?!.*--)[0-9]{0,10}$"
    //         },
    //----it will disable only
            // "ori-seq-no": {
            //     "type": "string",
            //     "pattern": "^(?!.*--)[a-zA-Z0-9]{0,35}$"
            // },
            
            //-----------------
        //    



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
} catch (err) {
    context.setVariable("CATCH_EXCEPTION_200", err);
    context.setVariable("linenumber", err.lineNumber);
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