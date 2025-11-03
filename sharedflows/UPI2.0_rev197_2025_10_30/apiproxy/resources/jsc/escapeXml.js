  try {
    var clientRequestFields = context.getVariable("clientRequestFields");
    var clientResponseFields = context.getVariable("clientResponseFields");
    var targetRequestFields = context.getVariable("targetRequestFields");
    var targetResponseFields = context.getVariable("targetResponseFields");
    var clientRequest = context.getVariable("clientRequest");
    var targetRequest = context.getVariable("targetRequest");
    var targetResponse = context.getVariable("targetResponse");
    // var target_Response = targetResponse.response;
    var clientResponse = context.getVariable("clientResponse"); 
    
    if(clientRequestFields !== null && clientRequestFields !== "" && clientRequestFields !==undefined){
    	clientRequestFields = escapeXml(clientRequestFields);
    	context.setVariable("clientRequestFields", clientRequestFields);
    }
    
    if(clientResponseFields !== null && clientResponseFields !== "" && clientResponseFields !==undefined){
     	clientResponseFields = escapeXml(clientResponseFields);
     	context.setVariable("clientResponseFields", clientResponseFields);
    }

    if(targetRequestFields !== null && targetRequestFields !== "" && targetRequestFields !==undefined){
	    targetRequestFields = escapeXml(targetRequestFields);
	    context.setVariable("targetRequestFields", targetRequestFields);
	}

	if(targetResponseFields !== null && targetResponseFields !== "" && targetResponseFields !==undefined){
        targetResponseFields = escapeXml(targetResponseFields);
        context.setVariable("targetResponseFields", targetResponseFields);
    }
    if(clientRequest !== null && clientRequest !== "" && clientRequest !==undefined){
        clientRequest = escapeXml(clientRequest);
        context.setVariable("clientRequest", clientRequest);
    }

    if(targetRequest !== null && targetRequest !== "" && targetRequest !==undefined){
	   targetRequest = escapeXml(targetRequest);
	   context.setVariable("targetRequest", targetRequest);
	}

// 	if(targetResponse !== null && targetResponse !== "" && targetResponse !==undefined){
// 	   targetResponse = escapeXml(targetResponse);
// 	   context.setVariable("targetResponse", targetResponse);
// 	}

	if(clientResponse !== null && clientResponse !== "" && clientResponse !==undefined){
	   clientResponse = escapeXml(clientResponse);
	   context.setVariable("clientResponse", clientResponse);
	}
// 	 if(target_Response !== null && target_Response !== "" && target_Response !==undefined){
//     	target_Response = escapeXml(target_Response);
//     // 	context.setVariable("target_Response", target_Response);
//         	targetResponse.response = target_Response;
//     }

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