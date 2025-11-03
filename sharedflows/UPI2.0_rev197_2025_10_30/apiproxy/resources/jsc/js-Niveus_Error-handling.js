try {
    
    
    var faultName = context.getVariable("fault.name");
    var host = context.getVariable("virtualhost.aliases");
    var requestPath = context.getVariable("request.path");
    var httpProtocol = context.getVariable("request.header.X-Forwarded-Proto");
    var url = httpProtocol + "://" + host[0] + requestPath;
    var proxy = context.getVariable("apiproxy.name");
    var pathsuffix = context.getVariable("proxy.pathsuffix");
    var defaultError = "";
    
    var responseBody, statusCode, encryptionFlag, reasonPhrase;

    if (proxy !== "EazyPay") {
        defaultError = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
        defaultContentType = 'json';
        if (context.getVariable("developer.app.name") === "WhatsApp Pay" || context.getVariable("developer.app.name") === "FG Pgp") {
            if (pathsuffix === "/upiTransactionStatus") {
                if (context.getVariable("messagevalidation.SMV-ValidateTransactionStatusRequest.failed") === true) {
                    var error = context.getVariable("error.content");
                    statusCode = 200;
                    contentType = 'plaintext';
                    encryptionFlag = true;

                    if (error.indexOf("Expecting a child element"))
                        responseBody = '<XML><transStatus>FAILURE</transStatus><transMessage>MISSING_REQUIRED_FIELD</transMessage></XML>';
                    else if (error.indexOf("Element name mismatch. Wildcard?"))
                        responseBody = '<XML><transStatus>FAILURE</transStatus><transMessage>FIELD SHOULD NOT BE REPEATED</transMessage></XML>';
                    else if (error.indexOf("Premature end of document"))
                        responseBody = '<XML><transStatus>FAILURE</transStatus><transMessage>MISSING_END TAG</transMessage></XML>';
                    else if (error.indexOf("Unexpected char while looking for open tag?"))
                        responseBody = '<XML><transStatus>FAILURE</transStatus><transMessage>XML is Empty</transMessage></XML>';
                    else
                        responseBody = '<XML><transStatus>FAILURE</transStatus><transMessage>INVALID_REQUEST.</transMessage></XML>';
                } else if (faultName === "FailedToResolveAPIKey" || faultName === "InvalidApiKey" || faultName === "InvalidApiKeyForGivenResource") {
                    responseBody = '{"success":false,"response":404,"message":"Resource Not Found","ValidationSummary":{"field-name":" "}}';
                    statusCode = 404;
                    contentType = 'textjson';
                    encryptionFlag = false;
                } else if (faultName === "ErrorResponseCode") {
                    if (context.getVariable("response.content") === "Requested Service Not Found !!" || context.getVariable("message.status.code") === 503) {
                        responseBody = '{"success":false,"response":8010,"message":"The system had an internal exception","ValidationSummary":{}}';
                        statusCode = 200;
                        contentType = 'json';
                        encryptionFlag = true;
                    }
                } else {
                    if (context.getVariable("JWT.failed") && context.getVariable("jwt.VJ-VerifyJwt.valid") === "false") {
                        responseBody = '{"success":"false","response":"8011","message":"Decryption Failure"}';
                        statusCode = 200;
                        contentType = 'json';
                        encryptionFlag = true;
                    } else {
                        responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                        statusCode = 500;
                        contentType = 'json';
                        encryptionFlag = false;
                    }
                }
            } else {
                switch (faultName) {
                    /*case "InvalidToken":
                        responseBody= '{"success":false,"response":404,"message":"Resource Not Found","ValidationSummary":{"field-name":" "}}';
                        statusCode= 404;
                        contentType= 'textjson';
                        encryptionFlag= false;
                        break;*/
                    case "FailedToResolveAPIKey":
                        responseBody = '{"success":false,"response":404,"message":"Resource Not Found","ValidationSummary":{"field-name":" "}}';
                        statusCode = 404;
                        contentType = 'textjson';
                        encryptionFlag = false;
                        break;

                    case "InvalidApiKey":
                        responseBody = '{"success":false,"response":404,"message":"Resource Not Found","ValidationSummary":{"field-name":" "}}';
                        statusCode = 404;
                        contentType = 'textjson';
                        encryptionFlag = false;
                        break;

                    case "InvalidApiKeyForGivenResource":
                        responseBody = '{"success":false,"response":404,"message":"Resource Not Found","ValidationSummary":{"field-name":" "}}';
                        statusCode = 404;
                        contentType = 'textjson';
                        encryptionFlag = false;
                        break;

                    case "ExecutionReturnedFailure":
                        if (context.getVariable("GLOBAL_CATCH_EXCEPTION") === "DECRYPTION_FAILURE") {
                            responseBody = '{"success":"false","response":"8011","message":"Decryption Failure"}';
                            statusCode = 200;
                            contentType = 'json';
                            encryptionFlag = true;
                        } else {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                            statusCode = 500;
                            contentType = 'textjson';
                            encryptionFlag = false;
                        }
                        break;

                    case "ErrorResponseCode":
                        if (context.getVariable("message.status.code") === 503) {
                            responseBody = '{"success":false,"response":8010,"message":"INTERNAL_SERVICE_FAILURE - The system had an internal exception","ValidationSummary":{"field-name":"Cannot connect to UPI Service"}}';
                            statusCode = 200;
                            contentType = 'json';
                            encryptionFlag = true;
                        } else if (context.getVariable("message.status.code") === 504) {
                            responseBody = '{"success":false,"response":8010,"message":"BACKEND_READ_TIMEOUT - Cannot read from service","ValidationSummary":{"field-name":"Cannot connect to UPI Service"}}';
                            statusCode = 200;
                            contentType = 'json';
                            encryptionFlag = true;
                        } else {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                            statusCode = 500;
                            contentType = 'textjson';
                            encryptionFlag = false;
                        }
                        break;

                    case "ConnectionTimeout":
                        responseBody = '{"success":false,"response":8010,"message":"BACKEND_CONNECTION_TIMEOUT - Cannot connect to service","ValidationSummary":{"field-name":"Cannot connect to UPI Service"}}';
                        statusCode = 200;
                        contentType = 'json';
                        encryptionFlag = true;
                        break;

                    default:
                        if (context.getVariable("JWT.failed") && context.getVariable("jwt.VJ-VerifyJwt.valid") === "false") {
                            responseBody = '{"success":false,"response":404,"message":"Resource Not Found","ValidationSummary":{"field-name":" "}}';
                            statusCode = 404;
                            contentType = 'textjson';
                            encryptionFlag = false;
                        } else {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                            statusCode = 500;
                            contentType = 'textjson';
                            encryptionFlag = false;
                        }
                }
            }
            
            //threat protection error
            if (faultName === "ExecutionFailed") {
                if (context.getVariable("jsonattack.failed") || context.getVariable("xmlattack.failed")) {
                    responseBody = 'HTTP Response Code :: 403\nDescription :: PNOC Security Alert: Document Structure Threat Detected\nFailed Threat Protection at ' + context.getVariable("system.time") + ' for request ' + url;
                    statusCode = 400;
                    contentType = 'plaintext';
                    encryptionFlag = false;
                } else {
                    responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                    statusCode = 500;
                    contentType = 'textjson';
                    encryptionFlag = false;
                }
            } else if (faultName === "ThreatDetected") {
                if (context.getVariable("regularexpressionprotection.RE-SQLAndCodeInjection.failed")) {
                    responseBody = 'HTTP Response Code :: 403\nDescription :: PNOC Security Alert: Code Injection/SQL Attack Detected\nFailed Threat Protection at ' + context.getVariable("system.time") + ' for request ' + url;
                    statusCode = 400;
                    contentType = 'plaintext';
                    encryptionFlag = false;
                } else {
                    responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                    statusCode = 500;
                    contentType = 'textjson';
                    encryptionFlag = false;
                }
            } else if (faultName === "ScriptExecutionFailed") {
                if (context.getVariable("cause") === "CodeInjectionParametersScript") {
                    responseBody = 'HTTP Response Code :: 403\nDescription :: PNOC Security Alert: Code Injection Detected\nFailed Threat Protection at ' + context.getVariable("system.time") + ' for request ' + url;
                    statusCode = 400;
                    contentType = 'plaintext';
                    encryptionFlag = false;
                } else if (context.getVariable("cause") === "SQLInjectionParametersScript") {
                    responseBody = 'HTTP Response Code :: 403\nDescription :: PNOC Security Alert: SQL Attack Detected\nFailed Threat Protection at ' + context.getVariable("system.time") + ' for request ' + url;
                    statusCode = 400;
                    contentType = 'plaintext';
                    encryptionFlag = false;
                } else {
                    responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                    statusCode = 500;
                    contentType = 'textjson';
                    encryptionFlag = false;
                }
            }
            
        } else {
            if(proxy === "WhatsApp") {
                if (faultName === "FailedToResolveAPIKey" || faultName === "InvalidApiKey" || faultName === "InvalidApiKeyForGivenResource") {
                    responseBody = '{"success":false,"response":404,"message":"Resource Not Found","ValidationSummary":{"field-name":" "}}';
                    statusCode = 404;
                    contentType = 'textjson';
                    encryptionFlag = false;
                }
            }
            else {
                switch (faultName) {
                    case "FailedToResolveAPIKey":
                        responseBody = '{"success":false,"response":401,"message":"INVALID_APIKEY","ValidationSummary":{"field-name":"The APIKey provided is not valid"}}';
                        statusCode = 200;
                        contentType = 'json';
                        encryptionFlag = true;
                        break;
    
                    case "InvalidApiKey":
                        responseBody = '{"success":false,"response":401,"message":"INVALID_APIKEY","ValidationSummary":{"field-name":"The APIKey provided is not valid"}}';
                        statusCode = 200;
                        contentType = 'json';
                        encryptionFlag = false;
                        break;
    
                    case "InvalidApiKeyForGivenResource":
                        responseBody = '{"success":false,"response":401,"message":"INVALID_APIKEY","ValidationSummary":{"field-name":"The APIKey provided is not valid"}}';
                        statusCode = 200;
                        contentType = 'json';
                        encryptionFlag = false;
                        break;
    
                    case "ExecutionFailed":
                        if (context.getVariable("jsonattack.failed") || context.getVariable("xmlattack.failed")) {
                            responseBody = 'HTTP Response Code :: 403\nDescription :: PNOC Security Alert: Document Structure Threat Detected\nFailed Threat Protection at ' + context.getVariable("system.time") + ' for request ' + url;
                            statusCode = 400;
                            contentType = 'plaintext';
                            encryptionFlag = false;
                        } else {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                            statusCode = 500;
                            contentType = 'json';
                            encryptionFlag = false;
                        }
                        break;
    
                    case "ScriptExecutionFailed":
                        if (context.getVariable("javascript.JS-CodeParametersInjection.failed") || (context.getVariable("cause") === "CodeInjectionParametersScript")) {
                            responseBody = 'HTTP Response Code :: 403\nDescription :: PNOC Security Alert: Code Injection Detected\nFailed Threat Protection at ' + context.getVariable("system.time") + ' for request ' + url;
                            statusCode = 400;
                            contentType = 'plaintext';
                            encryptionFlag = false;
                        } else if (context.getVariable("javascript.JS-SqlParametersInjection.failed") || (context.getVariable("cause") === "SQLInjectionParametersScript")) {
                            responseBody = 'HTTP Response Code :: 403\nDescription :: PNOC Security Alert: SQL Attack Detected\nFailed Threat Protection at ' + context.getVariable("system.time") + ' for request ' + url;
                            statusCode = 400;
                            contentType = 'plaintext';
                            encryptionFlag = false;
                        } else if (context.getVariable("cause") === "invalidParams") {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"validation":"Bad Request"}}';
                            statusCode = 400;
                            contentType = 'json';
                            encryptionFlag = false;
                        } else if (context.getVariable("cause") === "EmptyJSON") {
                            responseBody = '{"success":false,"response":8001,"message":"JSON IS EMPTY","ValidationSummary":{"field-name":"Invalid Request"}}';
                            statusCode = 200;
                            contentType = 'json';
                            encryptionFlag = true;
                        } else {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                            statusCode = 500;
                            contentType = 'json';
                            encryptionFlag = false;
                        }
                        break;
    
                    case "ThreatDetected":
                        if (context.getVariable("regularexpressionprotection.RE-SQLAndCodeInjection.failed")) {
                            responseBody = 'HTTP Response Code :: 403\nDescription :: PNOC Security Alert: Code Injection/SQL Attack\nFailed Threat Protection at ' + context.getVariable("system.time") + ' for request ' + url;
                            statusCode = 400;
                            contentType = 'plaintext';
                            encryptionFlag = false;
                        } else {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                            statusCode = 500;
                            contentType = 'json';
                            encryptionFlag = false;
                        }
                        break;
    
                    case "InvalidJSONPath":
                        if (context.getVariable("extractvariables.failed")) {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"validation":"Bad Request"}}';
                            statusCode = 400;
                            contentType = 'json';
                            encryptionFlag = false;
                        } else {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                            statusCode = 500;
                            contentType = 'json';
                            encryptionFlag = false;
                        }
                        break;
    
                    case "ExecutionReturnedFailure":
                        if (context.getVariable("GLOBAL_CATCH_EXCEPTION") === "DECRYPTION_FAILURE") {
                            responseBody = '{"success":"false","response":"8000","message":"Decryption Failure"}';
                            statusCode = 500;
                            contentType = 'json';
                            encryptionFlag = true;
                        } else {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                            statusCode = 500;
                            contentType = 'json';
                            encryptionFlag = false;
                        }
                        break;
    
                    case "ErrorResponseCode":
                        if (context.getVariable("message.status.code") === 503) {
                            responseBody = '{"success":false,"response":8010,"message":"BACKEND_CONNECTION_TIMEOUT - Cannot connect to service","ValidationSummary":{"field-name":"Cannot connect to UPI Service"}}';
                            statusCode = 200;
                            contentType = 'json';
                            encryptionFlag = true;
                        } else if (context.getVariable("message.status.code") === 504 || (context.getVariable("message.status.code") === 408)) {
                            if (proxy === "Google") {
                                responseBody = '{"success":false,"response":8010,"message":"BACKEND_READ_TIMEOUT - Cannot read from service","ValidationSummary":{"field-name":"Cannot connect to UPI Service"}}';
                                statusCode = 200;
                                contentType = 'json';
                                encryptionFlag = true;
                            } else {
                                responseBody = '{"success":false,"response":8013,"message":"BACKEND_READ_TIMEOUT - Cannot read from service","ValidationSummary":{"field-name":"Cannot connect to UPI Service"}}';
                                statusCode = 200;
                                contentType = 'json';
                                encryptionFlag = true;
                            }
                        } else {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                            statusCode = 500;
                            contentType = 'json';
                            encryptionFlag = true;
                        }
                        break;
    
                    case "ServiceUnavailable":
                        responseBody = '{"success":false,"response":8010,"message":"INTERNAL_SERVICE_FAILURE - The system had an internal exception","ValidationSummary":{"field-name":"Cannot connect to UPI Service"}}';
                        statusCode = 200;
                        contentType = 'json';
                        encryptionFlag = true;
                        break;
    
                    case "ConnectionTimeout":
                        responseBody = '{"success":false,"response":8012,"message":"BACKEND_CONNECTION_TIMEOUT - Cannot connect to service","ValidationSummary":{"field-name":"Cannot connect to UPI Service"}}';
                        statusCode = 200;
                        contentType = 'json';
                        encryptionFlag = true;
                        break;
    
                    case "RaiseFault":
                        if (context.getVariable("error.content") === "Requested Service Not Found !!") {
                            responseBody = 'Requested Service Not Found !!';
                            statusCode = 500;
                            contentType = 'plaintext';
                            encryptionFlag = false;
                        } else if (context.getVariable("error.content") === "SchemaValidationFailed") {
                            var request = JSON.parse(context.getVariable("request.content"));
                            var ErrorType = context.getVariable("ErrorType");
                            var fieldName = "";
                            var respCode = 8009;
                            var message = "";
    
                            if (ErrorType === "Missing Required Field") {
                                respCode = 8005;
                                  statusCode = 200;
                                message = "MISSING_REQUIRED_FIELD";
                                var field = JSON.parse(context.getVariable("ErrorField"));
                                fieldName = field.key;
                            } else if (ErrorType === "Field Pattern Violation" || context.getVariable("ErrorType") === "Invalid Data Type") {
                                respCode = 8003;
                                statusCode = 400;
                                message = "INVALID_FIELD FORMAT OR LENGTH";
                                fieldName = context.getVariable("ErrorField");
                            } else if (ErrorType === "Opening Curly Brace Missing") {
                                respCode = 8007;
                                  statusCode = 200;
                                message = "Invalid JSON,OPEN CURLY BRACE MISSING.";
                                fieldName = "Internal Server Error";
                            } else if (ErrorType === "Closing Curly Brace Missing") {
                                respCode = 8008
                                  statusCode = 200;
                                message = "Invalid JSON,END CURLY BRACE MISSING.";
                                fieldName = "Internal Server Error";
                            } else if (ErrorType === "Missing Required Field Data") {
                                respCode = 8004;
                                  statusCode = 200;
                                message = "MISSING_REQUIRED_FIELD_DATA";
                                fieldName = context.getVariable("ErrorField");
                            } else if (ErrorType === "Invalid Field Length") {
                                respCode = 8006;
                                  statusCode = 200;
                                message = "INVALID_FIELD_LENGTH";
                                var field = JSON.parse(context.getVariable("ErrorField"));
                                fieldName = field.key;
                            } else if (ErrorType === "Illegal Unquoted Character") {
                                respCode = 8002;
                                  statusCode = 200;
                                message = "INVALID_JSON.";
                                fieldName = "JSON is not valid";
                            }
    
                            var resp = {
                                "success": false,
                                "response": respCode,
                                "message": message,
                                "ValidationSummary": {
                                    "field-name": fieldName
                                }
                            };
    
                            responseBody = JSON.stringify(resp);
                            // statusCode = 200;
                            contentType = 'json';
                            encryptionFlag = true;
                        } else {
                            responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                            statusCode = 500;
                            contentType = 'json';
                            encryptionFlag = false;
                        }
                        break;
    
                    default:
                        responseBody = '{"success":false,"response":8009,"message":"Internal Server Error","ValidationSummary":{"field-name":" "}}';
                        statusCode = 500;
                        contentType = 'json';
                        encryptionFlag = false;
                }
            }
        }
    } else 
    {
        if (pathsuffix !== "/callbackResponse" || pathsuffix !== "/callbackResponseWithParentMID") {
            defaultError = 'Internal Server Error';
            defaultContentType = 'plaintext';
            switch (faultName) {

                // default error for below cases. will go in default case
                /*case "FailedToResolveAPIKey":        
                    responseBody= 'Internal Server Error';
                    statusCode= 500;
                    contentType= 'plaintext';
                    encryptionFlag= false;
                    break;
                
                case "InvalidApiKey":   
                   responseBody= 'Internal Server Error';
                    statusCode= 500;
                    contentType= 'plaintext';
                    encryptionFlag= false;
                    break;
                    
                case "InvalidApiKeyForGivenResource":        
                    responseBody= 'Internal Server Error';
                    statusCode= 500;
                    contentType= 'plaintext';
                    encryptionFlag= false;
                    break;*/

                case "ExecutionFailed":
                    if (context.getVariable("jsonattack.failed") || context.getVariable("xmlattack.failed")) {
                        responseBody = 'JSON/XML attack detected';
                        statusCode = 403;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    } else {
                        responseBody = 'Internal Server Error';
                        statusCode = 500;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    }
                    break;

                case "ScriptExecutionFailed":
                    if (context.getVariable("javascript.JS-CodeParametersInjection.failed") || context.getVariable("cause") === "CodeInjectionParametersScript") {
                        responseBody = 'Forbidden PNOC Security Alert: Code Injection Detected';
                        statusCode = 403;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    } else if (context.getVariable("javascript.JS-SqlParametersInjection.failed") || context.getVariable("cause") === "SQLInjectionParametersScript") {
                        responseBody = 'Forbidden PNOC Security Alert: SQL Attack Detected';
                        statusCode = 403;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    } else if (context.getVariable("cause") === "invalidParams" || context.getVariable("cause") === "schemaValidationFailed") {
                        responseBody = 'Internal Server Error';
                        statusCode = 500;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    } else if (context.getVariable("cause") === "EmptyJSON") {
                        responseBody = '{"success":"FAIL","response":"8001","message":"JSON IS EMPTY","merchantTranId":"' + context.getVariable("merchantId") + '"}';
                        statusCode = 400;
                        contentType = 'json';
                        encryptionFlag = true;
                       } else if (context.getVariable("cause") === "ServiceNotAllowed") {
                        responseBody = 'Requested Service Not Found !!';
                        statusCode = 500;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    } else if (context.getVariable("ErrorType") === "FailedToParseJSON") {
                        var resp = {
                            "response": "8002",
                            "merchantId": context.getVariable("merchantId"),
                            "subMerchantId": "",
                            "terminalId": "",
                            "success": "false",
                            "message": "INVALID_JSON.",
                            "BankRRN": "",
                            "merchantTranId": "",
                            "Amount": ""
                        };
                        responseBody = JSON.stringify(resp);
                        statusCode = 200;
                        contentType = 'json';
                        encryptionFlag = true;
                    } else {
                        responseBody = 'Internal Server Error';
                        statusCode = 500;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    }
                    break;

                case "ThreatDetected":
                    if (context.getVariable("regularexpressionprotection.RE-SQLAndCodeInjection.failed")) {
                        responseBody = 'Forbidden PNOC Security Alert: Code Injection/SQL Attack Detected';
                        statusCode = 403;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    } else {
                        responseBody = 'Internal Server Error';
                        statusCode = 500;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    }
                    break;

                case "RaiseFault":
                    if (context.getVariable("error.content") === "Requested Service Not Found !!") {
                        responseBody = 'Requested Service Not Found !!';
                        statusCode = 500;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    } else if (context.getVariable("error.content") === "SchemaValidationFailed") {
                        var request;
                        try {
                            request = JSON.parse(context.getVariable("request.content"));
                        } catch(err) {
                            context.setVariable("CATCH_EXCEPTION", err);
                        }
                        var ErrorType = context.getVariable("ErrorType");
                        var resp = {
                            "response": "",
                            "merchantId": "",
                            "subMerchantId": "",
                            "terminalId": "",
                            "success": "false",
                            "message": "",
                            "BankRRN": "",
                            "merchantTranId": "",
                            "Amount": ""
                        };
                        if(request) {
                            resp = {
                                "response": "",
                                "merchantId": request.merchantId,
                                "subMerchantId": request.subMerchantId,
                                "terminalId": request.terminalId,
                                "success": "false",
                                "message": "",
                                "BankRRN": request.BankRRN,
                                "merchantTranId": request.merchantTranId,
                                "Amount": request.Amount
                            };
                        }

                        if (ErrorType === "Missing Required Field") {
                            context.setVariable("HERE", "HERE");
                            resp.response = "8005";
                            resp.message = "MISSING_REQUIRED_FIELD";
                        } else if (ErrorType === "Field Pattern Violation" || context.getVariable("ErrorType") === "Invalid Data Type") {
                            resp.response = "8003";
                            resp.message = "INVALID_FIELD FORMAT OR LENGTH";
                        } else if (ErrorType === "Opening Curly Brace Missing") {
                            resp.response = "8007";
                            resp.message = "Invalid JSON,OPEN CURLY BRACE MISSING.";
                        } else if (ErrorType === "Closing Curly Brace Missing") {
                            resp.response = "8008";
                            resp.message = "Invalid JSON,END CURLY BRACE MISSING.";
                        } else if (ErrorType === "Missing Required Field Data") {
                            resp.response = "8004";
                            resp.message = "MISSING_REQUIRED_FIELD_DATA";
                        } else if (ErrorType === "Invalid Field Length") {
                            resp.response = "8006";
                            resp.message = "INVALID_FIELD_LENGTH";
                        } else if (ErrorType === "Illegal Unquoted Character" || ErrorType === "FailedToParseJSON") {
                            resp.response = "8002";
                            resp.message = "INVALID_JSON.";
                        } else if (ErrorType === "merchantTranId is mandatory") {
                            resp = {};
                            resp.response = "8005";
                            resp.status = "FAILURE";
                            resp.message = "merchantTranId is mandatory";
                        } else if (ErrorType === "Any one out of three of the fields are mandatory") {
                            resp = {};
                            resp.response = "8005";
                            resp.status = "FAILURE";
                            resp.message = "Any one out of three of the fields are mandatory";
                        }

                        if (ErrorType !== "merchantTranId is mandatory" && ErrorType !== "Any one out of three of the fields are mandatory")
                            resp = checkEmptyRespTags(resp);

                        responseBody = JSON.stringify(resp);
                        statusCode = 200;
                        contentType = 'json';
                        encryptionFlag = true;
                    } else {
                        responseBody = 'Internal Server Error';
                        statusCode = 500;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    }
                    break;

                case "ExecutionReturnedFailure":
                    if (context.getVariable("GLOBAL_CATCH_EXCEPTION") === "DECRYPTION_FAILURE") {
                        responseBody = '{"response": "8000","merchantId": "","subMerchantId": "","terminalId": "","success": "false","message": "Invalid Encrypted Request","merchantTranId": "","BankRRN": ""}';
                        statusCode = 400;
                        contentType = 'json';
                        encryptionFlag = true;
                    } else {
                        responseBody = 'Internal Server Error';
                        statusCode = 500;
                        contentType = 'plaintext';
                        encryptionFlag = false;
                    }
                    break;

                case "ErrorResponseCode":
                    context.setVariable("SWITCH_CASE", "ErrorResponseCode");
                    try {
                        var request = JSON.parse(context.getVariable("DECODED_DECRYPTED_CONTENT"));
                        resp = {
                            "response": "8010",
                            "merchantId": request.merchantId,
                            "subMerchantId": request.subMerchantId,
                            "terminalId": request.terminalId,
                            "success": "false",
                            "message": "INTERNAL_SERVICE_FAILURE-The system had an internal exception",
                            "merchantTranId": request.merchantTranId,
                            "BankRRN": request.BankRRN,
                            "Amount": request.Amount
                        };

                        responseBody = JSON.stringify(checkEmptyRespTags(resp));
                        contentType = 'json';
                    } catch (err) {
                        responseBody = "Internal Server Error";
                        contentType = 'plaintext';
                        context.setVariable("CATCH_EXCEPTION", err);
                    }
                    statusCode = context.getVariable("response.status.code");
                    encryptionFlag = true;
                    break;

                    // default error for below case    
                    /*case "ConnectionTimeout":        
                        responseBody= 'Internal Server Error';
                        statusCode= 500;
                        contentType= 'plaintext';
                        encryptionFlag= false;
                        break;*/

                default:
                    responseBody = 'Internal Server Error';
                    statusCode = 500;
                    contentType = 'plaintext';
                    encryptionFlag = false;
            }}
        // else if (pathsuffix == "/callbackResponse" || pathsuffix == "/callbackResponseWithParentMID") {
        //     defaultError = '{"XML":{"Notification":{"Response":"500"}}}';
        //     defaultContentType = 'json';
        //     encryptionFlag = false;
        //     statusCode = context.getVariable("response.status.code");
        //     if (typeof statusCode === "number") {
        //         var resp = {
        //             "XML": {
        //                 "Notification": {
        //                     "Response": ""
        //                 }
        //             }
        //         };
        //         resp.XML.Notification.Response = statusCode;
        //         responseBody = JSON.stringify(resp);
        //         contentType = 'json';
        //         statusCode = 200;
        //         context.setVariable("enableLogForFunctionalError", true);
        //     } else if (typeof statusCode === "object") {
        //         switch (faultName) {
        //             case "ScriptExecutionFailed":
        //                 if (context.getVariable("cause") === "CodeInjectionParametersScript") {
        //                     var req_host = context.getVariable('request.header.host');
        //                     var req_url = httpProtocol + "://" + req_host + requestPath;
        //                     responseBody = 'Forbidden PNOC Security Alert: Code Injection Detected. Failed Threat Protection at ' + new Date().toJSON() + ' for request ' + req_url;
        //                     statusCode = 403;
        //                     contentType = 'plaintext';
        //                 } else if (context.getVariable("javascript.JS-SqlParametersInjection.failed") || context.getVariable("cause") === "SQLInjectionParametersScript") {
        //                     var req_host = context.getVariable('request.header.host');
        //                     var req_url = httpProtocol + "://" + req_host + requestPath;
        //                     responseBody = 'Forbidden PNOC Security Alert: SQL Attack Detected. Failed Threat Protection at ' + new Date().toJSON() + ' for request ' + req_url;
        //                     statusCode = 403;
        //                     contentType = 'plaintext';
        //                 } else {
        //                     resp = {
        //                         "XML": {
        //                             "Notification": {
        //                                 "Response": "SchemaValidationFailed"
        //                             }
        //                         }
        //                     };
        //                     responseBody = JSON.stringify(resp);
        //                     statusCode = 200;
        //                     contentType = 'json';
        //                     context.setVariable("enableLogForFunctionalError", true);
        //                 }
        //                 break;
        //             case "ThreatDetected":
        //                 if (context.getVariable("regularexpressionprotection.RE-SQLAndCodeInjection.failed")) {
        //                     var req_host = context.getVariable('request.header.host');
        //                     var req_url = httpProtocol + "://" + req_host + requestPath;
        //                     responseBody = 'Forbidden PNOC Security Alert: Code Injection/SQL Attack Detected. Failed Threat Protection at ' + new Date().toJSON() + ' for request ' + req_url;
        //                     statusCode = 403;
        //                     contentType = 'plaintext';
        //                 } else {
        //                     resp = {
        //                         "XML": {
        //                             "Notification": {
        //                                 "Response": "500"
        //                             }
        //                         }
        //                     };
        //                     responseBody = JSON.stringify(resp);
        //                     statusCode = 200;
        //                     contentType = 'json';
        //                 }
        //                 break;
        //             case "ExecutionFailed":
        //                 if (context.getVariable("jsonattack.failed") || context.getVariable("xmlattack.failed")) {
        //                     var req_host = context.getVariable('request.header.host');
        //                     var req_url = httpProtocol + "://" + req_host + requestPath;
        //                     responseBody = 'Forbidden PNOC Security Alert: SQL Attack Detected. Failed Threat Protection at ' + new Date().toJSON() + ' for request ' + req_url;
        //                     statusCode = 403;
        //                     contentType = 'plaintext';
        //                 } else {
        //                     resp = {
        //                         "XML": {
        //                             "Notification": {
        //                                 "Response": "500"
        //                             }
        //                         }
        //                     };
        //                     responseBody = JSON.stringify(resp);
        //                     statusCode = 200;
        //                     contentType = 'json';
        //                 }
        //             break;
        //             case "RaiseFault":
        //             if (context.getVariable("error.content") === "Requested Service Not Found !!") {
        //                 responseBody = 'Requested Service Not Found !!';
        //                 statusCode = 500;
        //                 contentType = 'plaintext';
        //                 encryptionFlag = false;
        //             }
        //             else if (context.getVariable("error.content") === "SchemaValidationFailed") {
        //                     var request = JSON.parse(context.getVariable("request.content"));
        //                     var ErrorType = context.getVariable("ErrorType");
        //                     var fieldName = "";
        //                     var respCode = 8009;
        //                     var message = "";
    
        //                     if (ErrorType === "Missing Required Field") {
        //                         respCode = 8005;
        //                         message = "MISSING_REQUIRED_FIELD";
        //                         var field = JSON.parse(context.getVariable("ErrorField"));
        //                         fieldName = field.key;
        //                     } else if (ErrorType === "Field Pattern Violation" || context.getVariable("ErrorType") === "Invalid Data Type") {
        //                         respCode = 8003;
        //                         message = "INVALID_FIELD FORMAT OR LENGTH";
        //                         fieldName = context.getVariable("ErrorField");
        //                     }
        //             }  
        //             break;

                    
        //             default:
        //                 resp = {
        //                     "XML": {
        //                         "Notification": {
        //                             "Response": "500"
        //                         }
        //                     }
        //                 };
        //                 responseBody = JSON.stringify(resp);
        //                 statusCode = 200;
        //                 contentType = 'json';
        //         }
        //     } else {
        //         resp = {
        //             "XML": {
        //                 "Notification": {
        //                     "Response": "500"
        //                 }
        //             }
        //         };
        //         responseBody = JSON.stringify(resp);
        //         statusCode = 200;
        //         contentType = 'json';
        //     }
        //     if(statusCode !== 200)
        //         context.setVariable("enableLogForFunctionalError", true);
        //     if(contentType === 'json')
        //         context.setVariable("setResponseContentTypeXml", true);
        // }
    }


    try {
        if (contentType === "json" && pathsuffix !== "/callbackResponse") {
            var errResp = JSON.parse(responseBody);
            context.setVariable("error_code_from_client_response_payload", errResp.response);
        }
    // Author : Vinay Modified : 5-10-2021
    if (faultName == "SpikeArrestViolation" || faultName == "QuotaViolation") {
      responseBody = '{"success":false,"response":429,"message":"Too Many Requests","ValidationSummary":{"field-name":" "}}';
      statusCode = 429;
      contentType = 'textjson';
      encryptionFlag = false;
    }else if (statusCode == 200)
          reasonPhrase = "OK";
        else if (statusCode == 500)
          reasonPhrase = "Internal Server Error";
        else if (statusCode == 400)
          reasonPhrase = "Bad Request";
        else if (statusCode == 404)
          reasonPhrase = "Not Found";
        else if (statusCode == 403)
          reasonPhrase = "Forbidden";
          
        context.setVariable("flow.responseBody", responseBody);
        context.setVariable("flow.statusCode", statusCode);
        context.setVariable("flow.contentType", contentType);
        context.setVariable("flow.encryptionFlag", encryptionFlag);
        context.setVariable("flow.reasonPhrase", reasonPhrase);
    } catch (err) {
        context.setVariable("CATCH_EXCEPTION", err);
    }

} catch (err) {
    var responseBody, statusCode, encryptionFlag, contentType;
    responseBody = defaultError;
    statusCode = 500;
    contentType = defaultContentType;
    encryptionFlag = false;
    reasonPhrase = "Internal Server Error";

    context.setVariable("flow.responseBody", responseBody);
    context.setVariable("flow.statusCode", statusCode);
    context.setVariable("flow.contentType", contentType);
    context.setVariable("flow.encryptionFlag", encryptionFlag);
    context.setVariable("flow.reasonPhrase", reasonPhrase);
    context.setVariable("CATCH_EXCEPTION", err);
}

function checkIfNullOrEmpty(field) {
    return field === undefined || field === "" || field === null;
}

function checkEmptyRespTags(resp) {
    if (checkIfNullOrEmpty(resp.BankRRN))
        resp.BankRRN = "";
    if (checkIfNullOrEmpty(resp.Amount))
        resp.Amount = "";
    if (checkIfNullOrEmpty(resp.merchantTranId))
        resp.merchantTranId = "";
    if (checkIfNullOrEmpty(resp.terminalId))
        resp.terminalId = "";
    if (checkIfNullOrEmpty(resp.subMerchantId))
        resp.subMerchantId = "";
    if (checkIfNullOrEmpty(resp.merchantId))
        resp.merchantId = "";

    return resp;
}
 