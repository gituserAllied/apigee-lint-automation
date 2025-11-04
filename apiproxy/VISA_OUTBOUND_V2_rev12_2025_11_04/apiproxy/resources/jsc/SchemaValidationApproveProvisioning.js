var proxyBasePath = context.getVariable("proxy.basepath");
var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
var requestContent = context.getVariable("DECODED_DECRYPTED_CONTENT")?context.getVariable("DECODED_DECRYPTED_CONTENT"):context.getVariable("request.content")


//========================== Schema Validation ===========================================
try {
    var requestPayload = JSON.parse(requestContent);
    var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
    var schema = "";
        schema = {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "type": "object",
          "properties": {
            "panReferenceID": {
              "type": "string",
              "pattern":"^[A-Za-z0-9-]+$"
            },
            "walletAccountEmailAddressHash": {
              "type": "string"
            },
            "clientWalletAccountID": {
              "type": "string",
              "pattern":"^[A-Za-z0-9]+$"
            },
            "panSource": {
              "type": "string",
              "pattern":"^[A-Za-z0-9_]+$"
            },
            "cvv2ResultsCode": {
              "type": "string",
              "pattern":"^[A-Za-z0-9]+$"
            },
            "consumerEntryMode": {
              "type": "string",
              "pattern":"^[A-Za-z0-9_| ]+$"
            },
            "encryptedData": {
              "type": "string"
            },
            "deviceInfo": {
              "type": "object",
              "properties": {
                "deviceID": {
                  "type": "string",
                  "pattern":"^[A-Za-z0-9]+$"
                },
                "deviceLanguageCode": {
                  "type": "string",
                  "pattern":"^[A-Za-z0-9]+$"
                },
                "deviceType": {
                  "type": "string",
                  "pattern":"^[A-Za-z0-9_]+$"
                },
                "deviceName": {
                  "type": "string",
                  "pattern":"^[A-Za-z0-9 ]+$"
                },
                "deviceLocation": {
                  "type": "string",
                  "pattern":"^[A-Za-z0-9\-+\/.]+$"
                },
                "deviceIPAddressV4": {
                  "type": "string",
                  "pattern":"^[0-9.]+$"
                }
              },
              "required": [
                "deviceID",
                "deviceLanguageCode",
                "deviceType",
                "deviceName",
                "deviceLocation",
                "deviceIPAddressV4"
              ]
            },
            "lifeCycleTraceID": {
              "type": "integer",
              "pattern":"^[0-9-]+$"
            },
            "paymentAccountReference": {
              "type": "string",
              "pattern":"^[A-Za-z0-9]+$"
            },
            "tokenInfo": {
              "type": "object",
              "properties": {
                "tokenType": {
                  "type": "string",
                  "pattern":"^[A-Za-z0-9_]+$"
                },
                "numberOfActiveTokensForPAN": {
                  "type": "integer",
                },
                "numberOfInactiveTokensForPAN": {
                  "type": "integer"
                },
                "numberOfSuspendedTokensForPAN": {
                  "type": "integer"
                }
              },
              "required": [
                "tokenType",
                "numberOfActiveTokensForPAN",
                "numberOfInactiveTokensForPAN",
                "numberOfSuspendedTokensForPAN"
              ]
            }
          },
          "required": [
            "panReferenceID",
            "walletAccountEmailAddressHash",
            "clientWalletAccountID",
            "panSource",
            "cvv2ResultsCode",
            "consumerEntryMode",
            "encryptedData",
            "deviceInfo",
            "lifeCycleTraceID",
            "paymentAccountReference",
            "tokenInfo"
          ]
        };

        // ========================= Validation Schema ==============================
        var data = JSON.parse(context.getVariable("request.content"));
        var opt = tv4.validate(data, schema);
        context.setVariable("isSchemaValid", opt);
        if (opt === false) {
            context.setVariable("SchemaError", tv4.error.message);
            // validJson();
        }
} catch (err) {
    context.setVariable("CATCH_EXCEPTION", err);
}