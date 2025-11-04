 var requestContent = context.getVariable("request.content");
context.setVariable("request.content", requestContent);

// ============================== request msgdatetime =======================================
var d = new Date();// for today's current date
var dd = d.getDate()<10? ('0'+ d.getDate()) : d.getDate();
var mm = (d.getMonth()+1)<10 ? ('0'+ (d.getMonth()+1)):(d.getMonth()+1);
context.setVariable("month",mm);
var yy = d.getFullYear();
context.setVariable("year",yy);
var h  = d.getHours()<10? ('0'+d.getHours()):d.getHours();
var m  = d.getMinutes()<10? ('0'+d.getMinutes()):d.getMinutes();
var s  = d.getSeconds()<10? ('0'+d.getSeconds()):d.getSeconds();
var ms = d.getMilliseconds();



if(9<ms && ms<100){
ms='0'+ ms;
}else if(ms<10){
ms='00'+ ms;
}

var msgDateTime = yy+"-"+mm+"-"+dd+'T'+h+":"+m+":"+s+"."+ms.toString();
var msgDateTimeGCV = yy+"-"+mm+"-"+dd+' '+h+":"+m+":"+s.toString();
var RRN = yy+""+mm+""+dd+""+h+""+s.toString();
// ==============================/request msgdatetime =======================================
var requestTime = yy+mm+dd+h+m+s+ms.toString();
var date_MMddHHmmss = mm+dd+h+m+s.toString();
var date_mmss = m+s.toString();
var date_HHmmss = h+m+s.toString();
var date_MMdd = mm+dd.toString();

var HHMSSTime = h+""+m+""+s.toString();
var MMDD = mm+""+dd.toString();
var sliceYear = yy.toString().slice(2);
var YYMM = sliceYear+""+mm.toString();
var MMDDHHMMSS = mm+""+dd+""+h+""+m+""+s.toString();


context.setVariable("HHMSSTime",HHMSSTime);
context.setVariable("msgDateTimeGCV",msgDateTimeGCV);
context.setVariable("YYMM",YYMM);
context.setVariable("MMDDHHMMSS",MMDDHHMMSS);
context.setVariable("RRN",RRN);
context.setVariable("MMDD",MMDD);
context.setVariable("requestUUID",requestTime);
context.setVariable("msgDateTime",msgDateTime);

context.setVariable("date_MMddHHmmss",date_MMddHHmmss);
context.setVariable("date_mmss",date_mmss);
context.setVariable("date_HHmmss",date_HHmmss);
context.setVariable("date_MMdd",date_MMdd);

//======================================================================================


