var time = context.getVariable("system.timestamp");
var date = new Date(time + (3600000 * +5.5));
var year = date.getFullYear();
var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
var Tdate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
var sec = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
var msec = date.getMilliseconds().toString().length < 3 ? (date.getMilliseconds().toString().length < 2 ? "00" + date.getMilliseconds() : "0" + date.getMilliseconds()) : date.getMilliseconds();

var txntype = context.getVariable("txntype");
var incremental = context.getVariable("incremental");
incremental = parseInt(incremental);
var TimeStamp1 = year+'-'+month+'-'+Tdate+' '+hour+":"+min+":"+sec;
print("TimeStamp1 -- "+TimeStamp1);
context.setVariable("TimeStamp1", TimeStamp1);