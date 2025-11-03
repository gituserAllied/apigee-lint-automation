try{
    var versionsAllowed = context.getVariable("verifyapikey.VA-VerifyApiKey.versionsAllowed");
    var basepath = context.getVariable("proxy.basepath");
    var text = versionsAllowed;
    var myArray = text.split(",");
    var str = basepath;
    var isCorrectVerion = "0";
    context.setVariable("AllowedVersionErr",isCorrectVerion);
    if(myArray.length > 1){
      for (var i=0; i < myArray.length; i++) {
         if(str.indexOf(myArray[i]) > 1){
           isCorrectVerion = "1";
           break;
         }
      }
    }else{
      if(str.indexOf(text) > 1){
         isCorrectVerion = "1";
       }
    }
    context.setVariable("AllowedVersionErr",isCorrectVerion);
}catch(err){
     context.setVariable("CATCH_EXCEPTION", "JS-AllowedVersions error: " + err);
}