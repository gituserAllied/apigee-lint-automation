try {
    var plain_res = context.getVariable("misRequestPayload");
    var decryptedClientResponseplain_res = context.getVariable("decryptedClientResponse");
    var beneficiaryValidationResponseplain_res = context.getVariable("beneficiaryValidationResponse");
    var beneficiaryValidationResponseplain_res = context.getVariable("beneficiaryValidationResponse");
    var upiResponsePayloadplain_res = context.getVariable("upiResponsePayload");
    var impsResponsePayloadplain_res = context.getVariable("impsResponsePayload");
    var neftResponsePayloadplain_res = context.getVariable("neftResponsePayload");
    var rtgsResponsePayloadplain_res = context.getVariable("rtgsResponsePayload");
    var misResponsePayloadplain_res = context.getVariable("misResponsePayload");
    var clientRequestplain_res = context.getVariable("clientRequest");
    var clientResponseplain_res = context.getVariable("clientResponse");
    var targetPlaintextRequestplain_res = context.getVariable("targetPlaintextRequest");
    var decryptedClientResponse_res = context.getVariable("decryptedClientResponse");
    var beneResponse_res = context.getVariable("beneResponse");
    var kafka_status = context.getVariable("kafka_status");
    if(kafka_status !== null && kafka_status !== "" && kafka_status !==undefined){
    	kafka_status = escapeXml(kafka_status);
    	context.setVariable("kafka_status", kafka_status);
    }
    if(plain_res !== null && plain_res !== "" && plain_res !==undefined){
    	plain_res = escapeXml(plain_res);
    	context.setVariable("misRequestPayload", plain_res);
    }
    
    if(decryptedClientResponseplain_res !== null && decryptedClientResponseplain_res !== "" && decryptedClientResponseplain_res !==undefined){
    	decryptedClientResponseplain_res = escapeXml(decryptedClientResponseplain_res);
    	context.setVariable("decryptedClientResponse", decryptedClientResponseplain_res);
    }
    if(beneficiaryValidationResponseplain_res !== null && beneficiaryValidationResponseplain_res !== "" && beneficiaryValidationResponseplain_res !==undefined){
    	beneficiaryValidationResponseplain_res = escapeXml(beneficiaryValidationResponseplain_res);
    	context.setVariable("beneficiaryValidationResponse", beneficiaryValidationResponseplain_res);
    }
    if(upiResponsePayloadplain_res !== null && upiResponsePayloadplain_res !== "" && upiResponsePayloadplain_res !==undefined){
    	upiResponsePayloadplain_res = escapeXml(upiResponsePayloadplain_res);
    	context.setVariable("upiResponsePayload", upiResponsePayloadplain_res);
    }
    if(impsResponsePayloadplain_res !== null && impsResponsePayloadplain_res !== "" && impsResponsePayloadplain_res !==undefined){
    	var impsResponsePayload_Json = JSON.parse(impsResponsePayloadplain_res);
    	if(impsResponsePayload_Json.hasOwnProperty('content')){
    	    context.setVariable("impsResponsePayloadplain", impsResponsePayloadplain_res);
    	}else{
    	context.setVariable("impsResponsePayloadplain", null);
    	}
    }
    if(neftResponsePayloadplain_res !== null && neftResponsePayloadplain_res !== "" && neftResponsePayloadplain_res !==undefined){
    	neftResponsePayloadplain_res = escapeXml(neftResponsePayloadplain_res);
    	context.setVariable("neftResponsePayload", neftResponsePayloadplain_res);
    }
    if(rtgsResponsePayloadplain_res !== null && rtgsResponsePayloadplain_res !== "" && rtgsResponsePayloadplain_res !==undefined){
    	rtgsResponsePayloadplain_res = escapeXml(rtgsResponsePayloadplain_res);
    	context.setVariable("rtgsResponsePayload", rtgsResponsePayloadplain_res);
    }
    if(misResponsePayloadplain_res !== null && misResponsePayloadplain_res !== "" && misResponsePayloadplain_res !==undefined){
    	misResponsePayloadplain_res = escapeXml(misResponsePayloadplain_res);
    	context.setVariable("misResponsePayload", misResponsePayloadplain_res);
    }
    if(clientRequestplain_res !== null && clientRequestplain_res !== "" && clientRequestplain_res !==undefined){
    	clientRequestplain_res = escapeXml(clientRequestplain_res);
    	context.setVariable("clientRequest", clientRequestplain_res);
    }
    if(clientResponseplain_res !== null && clientResponseplain_res !== "" && clientResponseplain_res !==undefined){
    	clientResponseplain_res = escapeXml(clientResponseplain_res);
    	context.setVariable("clientResponse", clientResponseplain_res);
    }
    if(targetPlaintextRequestplain_res !== null && targetPlaintextRequestplain_res !== "" && targetPlaintextRequestplain_res !==undefined){
    	targetPlaintextRequestplain_res = escapeXml(targetPlaintextRequestplain_res);
    	context.setVariable("targetPlaintextRequest", targetPlaintextRequestplain_res);
    }
    if(decryptedClientResponse_res !== null && decryptedClientResponse_res !== "" && targetPlaintextRequestplain_res !==undefined){
    	decryptedClientResponse_res = escapeXml(decryptedClientResponse_res);
    	context.setVariable("decryptedClientResponse", decryptedClientResponse_res);
    }
    if(beneResponse_res !== null && beneResponse_res !== "" && beneResponse_res !==undefined){
    	beneResponse_res = escapeXml(beneResponse_res);
    	context.setVariable("beneResponse", beneResponse_res);
    }

} catch(err) {
    context.setVariable("CATCH_EXCEPTION", "escapeXml error: " + err);
}
function escapeXml(unsafe) {
return unsafe.replace(/[<>&']/g, function(c) {
 switch (c) {
 case '<':
 return '&lt;';
 case '>':
 return '&gt;';
 case '&':
 return '&amp;';
 case '\'':
 return '&apos;';
 }
 });
}