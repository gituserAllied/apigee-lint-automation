var data= JSON.parse(context.getVariable('response.content'));

var proxyPathSuffix = context.getVariable("proxy.pathsuffix");
delete data.PayeeRevRespCode;
delete data.UserProfile;
 
if(data.MobileAppData.hasOwnProperty("OriginalTxnId")){
delete data.MobileAppData.OriginalTxnId;
}
// delete data.MobileAppData.OriginalTxnId;
delete data.BankRRN;
delete data.ActCode;
delete data.UpiTranlogId;
// delete data.MobileAppData.PayeeRespCode;
delete data.PayeeRespCode;
delete data.PayerRevRespCode;
delete data.PayerRespCode;
var body = JSON.stringify(data);
context.setVariable('response.content',body);