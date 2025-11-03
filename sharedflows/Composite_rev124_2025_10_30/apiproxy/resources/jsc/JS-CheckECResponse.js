var checkECStatus = context.getVariable("connectorcallout.EC-CompositeMIS.failed"); //connectorcallout.EC-CompositeMIS.failed
var dbInsertRequest = context.getVariable("dbInsertRequest");
context.setVariable("dbInsertRequest","NA");
context.setVariable("ECCompositeMIS",checkECStatus);
if(!checkIfEmpty(checkECStatus) && checkECStatus === true && !checkIfEmpty(dbInsertRequest)){
    context.setVariable("dbInsertRequest",dbInsertRequest);
}else if(!checkIfEmpty(checkECStatus) && checkECStatus === true && checkIfEmpty(dbInsertRequest)){
    context.setVariable("dbInsertRequest","blank");
}
function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}
