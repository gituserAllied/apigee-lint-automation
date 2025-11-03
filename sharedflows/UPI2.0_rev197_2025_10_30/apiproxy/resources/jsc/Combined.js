if(context.getVariable("developer.app.name") === "freshgravity") {
    print("here");
    context.setVariable("DECODED_DECRYPTED_CONTENT", context.getVariable("request.content"));
}

replacePlusSign();
setRequestContent();
createEncodedRequest();
targetRouting();
setUrlEncodedMessage();


function replacePlusSign(){
	var payload = context.getVariable("DECODED_DECRYPTED_CONTENT");
	var updatedPayload = payload.replace(/\+/g, "%2b");
	context.setVariable("DECODED_DECRYPTED_CONTENT", updatedPayload);
    
}

function setRequestContent(){
    //These changes are w.r.t AM-SetPayload in Decryption Flow
    var DECODED_DECRYPTED_CONTENT = context.getVariable("DECODED_DECRYPTED_CONTENT");
    var messageid = context.getVariable("messageid");
    context.setVariable("request.content", DECODED_DECRYPTED_CONTENT);
    context.setVariable("request.header.apigee-message-id",messageid);    
}

function createEncodedRequest(){
//Creates URL Encoded Request in JS
try {
    
    var inputRequest = JSON.parse(context.getVariable("request.content"));
    var outputRequest = "";
    var noOfKeys = Object.keys(inputRequest).length;
    var counter = 1;

    for (var key in inputRequest) {
     var result = (typeof inputRequest[key] === 'object');
         if(result)
          {
              key1 = key.replace(/[-]/g, " ");
              key2= camelCase(key1);
                if(inputRequest['channel-code'] != "TATA"){
                   inputRequest[key] = '{"' + key2 + '":' + JSON.stringify(inputRequest[key]) + '}';
                }else{
                    if(key == "VPA-list"){
                    	key3= "vpaList";
                    	inputRequest[key3] = '{"' + key3 + '":' + JSON.stringify(inputRequest[key][0]['vpaList']) + '}';
                        key = "vpa-list";
                        inputRequest[key] =inputRequest[key3];
					}else{
                    	inputRequest[key] = '{"' + key2 + '":' + JSON.stringify(inputRequest[key]) + '}';
                    }
                }
          }
        if (counter < noOfKeys)
            outputRequest = (outputRequest + (key + "=" + inputRequest[key] + "&"));
        else
            outputRequest = (outputRequest + (key + "=" + inputRequest[key]));

        counter++;
    }
    
    /*
        logic to change the backed url for List PSP and List PSP Keys APIs
    */
    if(context.getVariable("proxy.pathsuffix") === "/ListPSP") {
        if(noOfKeys > 4) {
            context.setVariable("backendUrl", "list-psp-keys");
        }
        else {
            context.setVariable("backendUrl", "list-psp");
        }
    }
    
} catch (error) {
    print(error);

}

context.setVariable("urlEncodedRequest", outputRequest);

}

function targetRouting(){
try {
  var backendUrl = context.getVariable("private.backendUrl");
  var apitype = context.getVariable("private.apitype");
  print("APITYPE = ",apitype);
  var finantialUrl = context.getVariable("private.finantialUrl");
    print("finantialUrl =",finantialUrl);

  var nonFinantialUrl = context.getVariable("private.nonFinantialUrl");
      print("nonFinantialUrl =",nonFinantialUrl);
    var udirUrl = "/udir/web-upi-server/upi/";
//   var udirUrl = context.getVariable("private.udirUrl");
        print("udirUrl =",udirUrl);

  
  var pathsuffix = context.getVariable("proxy.pathsuffix");

  var pathPrefix = "/web-upi-server/upi/"; 


  if (pathsuffix === "/ListPSP")
    backendUrl = context.getVariable("backendUrl");

  if ((apitype === "FIN") && (finantialUrl !== null))
    pathPrefix = finantialUrl;
  else if ((apitype === "Non-FIN") && (nonFinantialUrl !== null))
    pathPrefix = nonFinantialUrl;
  else if ((apitype === "UDIR") && (udirUrl !== null))
    pathPrefix = udirUrl;
print(pathPrefix);
// if(pathsuffix === "/PayToContact")
//  pathPrefix = "/wa/web-upi-server/upi/"; 
  context.setVariable("modifiedUrl", pathPrefix + backendUrl);
  context.setVariable("target.copy.pathsuffix", false);
} catch (err) {
  print(error);
}
}

function setUrlEncodedMessage(){
    var urlEncodedRequest = context.getVariable("urlEncodedRequest");
    context.setVariable("request.content", urlEncodedRequest);
}
function camelCase(str) { 
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) 
            { 
                return index == 0 ? word.toLowerCase() : word.toUpperCase(); 
            }).replace(/\s+/g, ''); 
        } 