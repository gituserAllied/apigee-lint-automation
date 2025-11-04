var resp = context.getVariable("response.content");
var resRp = resp.replace('"','');
var resSp = resRp.split("|");

context.setVariable("actionCode",resSp);