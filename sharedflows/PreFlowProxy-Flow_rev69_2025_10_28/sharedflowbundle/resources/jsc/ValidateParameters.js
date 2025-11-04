function validate_parameters() {

  try {
    var pathsuffix = context.getVariable("proxy.pathsuffix");
    var proxy = context.getVariable("apiproxy.name");
    var contentType = context.getVariable("request.header.Content-Type");

    if (proxy == "UPI1.0" || proxy == "UPI2.0") {
      if (contentType !== "application/xml" && contentType !== "application/json" && contentType !== "text/plain") {
        context.setVariable("cause", "invalidParams");
        throw "invalidContentType";
      }
      if (contentType === "text/plain") {
        context.setVariable("request.header.Eazypay-Body", context.getVariable("request.content")); //setting body in header for sql and code injection check
      }
      checkEmptyQuerypParams(proxy);
      checkValidHeaderContent();
    } else if (proxy === "EazyPay") {
      if (pathsuffix !== "/callbackResponse" && contentType !== "text/plain") {
        context.setVariable("cause", "invalidParams");
        throw "invalidContentType";
      } else if (pathsuffix === "/callbackResponse" && contentType !== "application/xml") {
        context.setVariable("cause", "invalidParams");
        throw "invalidContentType";
      } else if (contentType === "text/plain") {
        context.setVariable("request.header.Eazypay-Body", context.getVariable("request.content")); //setting body in header for sql and code injection check
      }
      checkEmptyQuerypParams(proxy);
      checkValidHeaderContent();
    } else if (proxy == "LOP") {
      if (contentType !== "application/json") {
        context.setVariable("cause", "invalidParams");
        throw "invalidContentType";
      }
      //Check if query param service is valid
      var serviceType = context.getVariable("request.queryparam.service");
      if (serviceType === null || serviceType === undefined) {
        context.setVariable("cause", "invalidParams");
        throw "invalidQueryParams";
      } else {
        // create KVM Key for pulling response fields data
        context.setVariable("ResponseFieldsKey", serviceType + "-Response");
        // create KVM Key for pulling downstream credentials
        context.setVariable("APITargetCredentials", serviceType + "-Credentials");
      }
      checkEmptyQuerypParams(proxy);
      checkValidHeaderContent();
    } else if (proxy == "PayLater") {
      if (contentType !== "application/json") {
        context.setVariable("cause", "invalidParams");
        throw "invalidContentType";
      }
      checkEmptyQuerypParams(proxy);
      checkValidHeaderContent();
    }
    //   checkValidHeaderContent();
  } catch (err) {
    context.setVariable("cause", "invalidParams");
    throw "defaultError";
  }
}

function checkEmptyQuerypParams(proxy) {
  var queryParamCount = context.getVariable("request.queryparams.count");
  if (proxy == "LOP") {
    if (queryParamCount > 2) {
      context.setVariable("cause", "invalidParams");
      throw "invalidQueryParams";
    }
  } else {
    if (queryParamCount > 0) {
      context.setVariable("cause", "invalidParams");
      throw "invalidQueryParams";
    }
  }
}

function checkValidHeaderContent() {
  var validHeaderList = ["Content-Type"];
  var validHeaderFlag = true;

  for (var i = 0; i < validHeaderList.length; i++) {
    var list_data = context.getVariable("request.header." + validHeaderList[i]);
    if (list_data === null || list_data === undefined)
      validHeaderFlag = false;
  }
  if (!validHeaderFlag) {
    context.setVariable("cause", "invalidParams");
    throw "invalidHeaderParams";
  }
}