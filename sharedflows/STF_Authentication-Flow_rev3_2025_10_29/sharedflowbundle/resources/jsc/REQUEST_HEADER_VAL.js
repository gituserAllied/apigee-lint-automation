var requiredHeaders = ["apikey", "authorization", "x-forwarded-for", "content-type"];
var allowedContentTypes = ["application/json", "application/xml", "text/xml", "text/json"];
var allowedMethods = ["POST", "OPTIONS"];
var allowedHeaders = ["apikey", "authorization", "x-forwarded-for", "content-type"];


var missingHeaders = [];
var errorMsg = null;

// ======== VALIDATE REQUIRED HEADERS ========
for (var i = 0; i < requiredHeaders.length; i++) {
    var headerName = requiredHeaders[i];
    var headerValue = context.getVariable("request.header." + headerName);
    if (!headerValue) {
        missingHeaders.push(headerName);
    }
}

if (missingHeaders.length > 0) {
    setError("MissingHeader","HeaderValidation", "Missing required headers: " + missingHeaders.join(", "));
}



// ======== VALIDATE CONTENT-TYPE ========
var contentType = context.getVariable("request.header.Content-Type");
if (!contentType) {
    setError("MissingHeader","HeaderValidation", "Missing required headers: " + missingHeaders.join(", "));
} else {
    var isAllowed = allowedContentTypes.some(function (type) {
        return contentType.toLowerCase().indexOf(type) !== -1;
    });
    if (!isAllowed) {
        setError("InvalidContentType","ContentTypeValidation", "Unsupported Content-Type: " + contentType +
                      ". Allowed: " + allowedContentTypes.join(",")
                      );
    }
}




function setError(err,cause,errorMessage) {
    context.setVariable("cause", cause);
    context.setVariable("errorMessage", errorMessage);
    throw err;
}