var responseContent = {
            "requestId": context.getVariable("developer.app.name"),
            "service": "Composite",
            "oaepHashingAlgorithm" : "NONE",
            "iv":"",
            "encryptedKey": context.getVariable("ENCODED_ENCRYPTED_KEY"),
            "encryptedData": context.getVariable("ENCODED_ENCRYPTED_CONTENT")
        }
        
context.setVariable("dbInsertReq", JSON.stringify(responseContent));