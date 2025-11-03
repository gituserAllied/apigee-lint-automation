//Set REQUEST, RESPONSE, ERROR flows
function setVariable(variable, value) {
    context.setVariable(variable, value);
}

function checkIfNullOrEmpty(value) {
    return value === undefined || value === null || value === "";
}

//Escape XML for storage into StackDriver
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function(c) {
        switch (c) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '&':
                return '&amp;';
            case '\'':
                return '&apos;';
            case '"':
                return '&quot;';
        }
    });
}

function setContent(variable, content, contentType) {
    try {
        if (contentType.startsWith("application/json")) {
            setVariable(variable, (checkIfNullOrEmpty(content) ? JSON.stringify({}) : content));
            try {
                var isValidJSON = JSON.parse(content);
            } catch (error) {
                print(error);
                setVariable(variable, JSON.stringify({
                    "content": content
                }));
            }
        } else if (contentType.startsWith("application/xml") || contentType.startsWith("text/xml")) {
            setVariable(variable, (checkIfNullOrEmpty(content) ? JSON.stringify({}) : JSON.stringify({
                "content": escapeXml(content)
            })));
        } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
            setVariable(variable, (checkIfNullOrEmpty(content) ? JSON.stringify({}) : JSON.stringify({
                "content": content
            })));
        } else if (contentType.startsWith("text/plain")) {
            setVariable(variable, (checkIfNullOrEmpty(content) ? JSON.stringify({}) : JSON.stringify({
                "content": content
            })));
        } else setVariable(variable, (checkIfNullOrEmpty(content) ? JSON.stringify({}) : JSON.stringify({
            "content": content
        })));
    } catch (error) {
        print(error);
        setVariable(variable, JSON.stringify({}));
    }
}

try{
    
  setContent("clientRequest_abcd", context.getVariable("incomingRequest.content"), context.getVariable("incomingRequest.header.Content-Type"));
setContent("targetRequest_abcd", context.getVariable("request.content"), context.getVariable("request.header.Content-Type"));
setContent("targetResponse_abcd", context.getVariable("iciciTargetResponse.content"), context.getVariable("iciciTargetResponse.header.Content-Type"));
setContent("clientResponse_abcd", context.getVariable("response.content"), context.getVariable("response.header.Content-Type"));

            


}
catch(e){
    print("abdlogging")
    print(e);
}