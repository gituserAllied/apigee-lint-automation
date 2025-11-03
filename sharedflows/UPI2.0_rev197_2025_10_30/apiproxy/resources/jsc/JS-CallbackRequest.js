var type = context.getVariable("error.content") ? "err" : "resp"
var cnt = context.getVariable("request.header.counts")
var currentDate = getTimeArray();
var messageDateTime = currentDate[0] + '-' + ('00' + currentDate[1]).slice(-2) + '-' + ('00' + currentDate[2]).slice(-2); //+'T'+ ('00' + currentDate[3]).slice(-2) +':'+ ('00' + currentDate[4]).slice(-2) +':'+ ('00' + currentDate[5]).slice(-2);
var timeform = currentDate[0] + '-' + ('00' + currentDate[1]).slice(-2) + '-' + ('00' + currentDate[2]).slice(-2) + 'T' + ('00' + currentDate[3]).slice(-2) + ':' + ('00' + currentDate[4]).slice(-2) + ':' + ('00' + currentDate[5]).slice(-2) + '.' + ('000' + currentDate[6]).slice(-3);
var SrcMsgId = currentDate[0] + ('00' + currentDate[1]).slice(-2) + ('00' + currentDate[2]).slice(-2) + ('00' + currentDate[3]).slice(-2) + ('00' + currentDate[4]).slice(-2) + ('00' + currentDate[5]).slice(-2);
//var callbackInitiationTime = currentDate[0] + '-' + ('00' + currentDate[1]).slice(-2) + '-' + ('00' + currentDate[2]).slice(-2) + 'T' + ('00' + currentDate[3]).slice(-2) + ':' + ('00' + currentDate[4]).slice(-2) + ':' + ('00' + currentDate[5]).slice(-2) + 'Z';
var callbackInitiationTime = currentDate[0] + '-' + ('00' + currentDate[1]).slice(-2) + '-' + ('00' + currentDate[2]).slice(-2) + 'T' + ('00' + currentDate[3]).slice(-2) + ':' + ('00' + currentDate[4]).slice(-2) + ':' + ('00' + currentDate[5]).slice(-2)  + '.' + ('000' + currentDate[6]).slice(-3) + 'Z';
context.setVariable("callbackInitiationTime", callbackInitiationTime);
context.setVariable("messageDateTime", messageDateTime);
context.setVariable("SrcMsgId", SrcMsgId);
context.setVariable("timeform", timeform);
context.setVariable("verifyapikey.VA-VerifyApiKey.mode","hybrid_generic")
context.setVariable("mode","hybrid_generic")
if( cnt > 0){
    var req = JSON.parse(context.getVariable("request.content"))
    context.setVariable("encodedEncryptedContent",req.encryptedData)
    context.setVariable("encodedEncryptedKey",req.encryptedKey)
    context.setVariable("encodedIv",req.iv)
    
}

if(type==="resp"){
    context.setVariable("response.header.counts", context.getVariable('counts'))
}
  
function getTimeArray(){
	var dateObj = new Date();
	var utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
	// using supplied offset of 5.5 (Indian offset)
// 	var nd = new Date(utc + (3600000 * 5.5));
		var nd = new Date(utc);
	var year = nd.getFullYear();
	var month = "";
	if(nd.getMonth()< 9){
	month = "0" + (nd.getMonth() + 1).toString();
	}
	else{
	month = (nd.getMonth() + 1).toString();
	}
	var date = nd.getDate();
	var hour = nd.getHours();
	var min = parseInt(nd.getMinutes());
	var sec = parseInt(nd.getSeconds());
	var milliSec = nd.getMilliseconds();
	var mili = "000";
	if(milliSec.toString().length < 3){
        var count  = milliSec.toString().length;
        if(count==1){
            mili ='00'+ milliSec;
        }
        else{
            mili ='0'+ milliSec;
        }
        
    }
    else{
        mili  = milliSec.toString();
    }

	return [year,month,date,hour,min,sec,mili];
}