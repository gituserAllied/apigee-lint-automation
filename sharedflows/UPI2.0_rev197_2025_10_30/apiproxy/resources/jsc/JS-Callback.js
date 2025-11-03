// var pubsubreq = {
//     "requestId": "e180ed70-6d3f-4985-a60e-46b51ee33e78",
//     "encryptedKey": context.getVariable("ENCODED_ENCRYPTED_KEY"),
//     "encryptedData": context.getVariable("ENCODED_ENCRYPTED_CONTENT"),
//     "iv": "",
//     "service": "",
//     "clientInfo": "",
//     "optionalParam": "",
//     "oaepHashingAlgorithm": "NONE",
//     "getwaystatus":context.getVariable("fault.name")
// }
// var t = context.getVariable("fault.name")
// context.setVariable("getwaystatus",String(t))
// context.setVariable("response.header.getwaystatus",String(t))
// context.setVariable("error.header.getwaystatus",String(t))
// var cnt = context.getVariable("request.header.counts")
// context.setVariable("pubsubReq",JSON.stringify(pubsubreq))
// context.setVariable("response.header.counts",String(parseInt(cnt)+1))
// context.setVariable("error.header.counts",String(parseInt(cnt)+1))
// context.setVariable("statusCodeForSkipPubSub",context.getVariable("response.status.code"))


var pubsubreq = {
    "requestId": "e180ed70-6d3f-4985-a60e-46b51ee33e78",
    "encryptedKey": context.getVariable("ENCODED_ENCRYPTED_KEY"),
    "encryptedData": context.getVariable("ENCODED_ENCRYPTED_CONTENT"),
    "iv": "",
    "service": "",
    "clientInfo": "",
    "optionalParam": "",
    "oaepHashingAlgorithm": "NONE",
    "getwaystatus":context.getVariable("fault.name")
}
var t = context.getVariable("fault.name")
context.setVariable("getwaystatus",String(t))
context.setVariable("response.header.getwaystatus",String(t))
context.setVariable("error.header.getwaystatus",String(t))
var cnt = context.getVariable("request.header.counts")
context.setVariable("callbackPubSubCount",cnt)
context.setVariable("pubsubReq",JSON.stringify(pubsubreq))
context.setVariable("response.header.counts",String(parseInt(cnt)+1))
context.setVariable("error.header.counts",String(parseInt(cnt)+1))
context.setVariable("statusCodeForSkipPubSub",context.getVariable("response.status.code")?context.getVariable("response.status.code"):0)

//Send Time to GCp Callback
var currentDate = getTimeArray();
var messageDateTime = currentDate[0] + '-' + ('00' + currentDate[1]).slice(-2) + '-' + ('00' + currentDate[2]).slice(-2); //+'T'+ ('00' + currentDate[3]).slice(-2) +':'+ ('00' + currentDate[4]).slice(-2) +':'+ ('00' + currentDate[5]).slice(-2);
var timeform = currentDate[0] + '-' + ('00' + currentDate[1]).slice(-2) + '-' + ('00' + currentDate[2]).slice(-2) + 'T' + ('00' + currentDate[3]).slice(-2) + ':' + ('00' + currentDate[4]).slice(-2) + ':' + ('00' + currentDate[5]).slice(-2) + '.' + ('000' + currentDate[6]).slice(-3);
var SrcMsgId = currentDate[0] + ('00' + currentDate[1]).slice(-2) + ('00' + currentDate[2]).slice(-2) + ('00' + currentDate[3]).slice(-2) + ('00' + currentDate[4]).slice(-2) + ('00' + currentDate[5]).slice(-2);
context.setVariable("sendTOGCPmessageDateTime", messageDateTime);
context.setVariable("sendTOGCPSrcMsgId", SrcMsgId);
context.setVariable("sendTOGCPtimeform", timeform);


function getTimeArray(){
	var dateObj = new Date();
	var utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
	// using supplied offset of 5.5 (Indian offset)
	var nd = new Date(utc + (3600000 * 5.5));
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
	context.setVariable('mili',milliSec)
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