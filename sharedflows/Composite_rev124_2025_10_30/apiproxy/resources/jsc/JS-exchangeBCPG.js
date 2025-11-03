var req = context.getVariable("request.content");
var substring;
var newreq;
if(req.indexOf("v1.")<0){
    substring = req.substring(req.indexOf("v2."),req.indexOf("v2.")+5);
     newreq=req.replace(substring,"v1.61");
}
else{ substring = req.substring(req.indexOf("v1."),req.indexOf("v1.")+5);
    newreq=req.replace(substring,"v1.61");
}
print("newreq : "+newreq);
context.setVariable("req",newreq);