  var Origin = context.getVariable('request.header.Origin');
        if(Origin){
        context.setVariable("exceptionStatus", 400);
          var finalResponse = {
            "success": false,
            "errorcode": "400",
            "errormessage": "Invalid Header."
        };
        throw JSON.stringify(finalResponse);
      }
