var actcode = context.getVariable("actcode");
var cvv2ResultsCode = context.getVariable("AP.cvv2ResultsCode");
var res;


switch(actcode){
    case "85":
        res = '{"actionCode":"85"}' ;
        break;
    case "00":
        res = '{"actionCode":"00"}' ;
        break;
    case "05":
        res = '{"actionCode":"05","cvv2ResultsCode":"'+cvv2ResultsCode+'","errorCode":"ISE40006"}' ;
        break;
    case "N7":
        res = '{"actionCode":"N7","cvv2ResultsCode":"'+cvv2ResultsCode+'","errorCode":"ISE40106"}' ;
        break;
    case "54":
        res = '{"actionCode":"54","cvv2ResultsCode":"'+cvv2ResultsCode+'","errorCode":"ISE40106"}' ;
        break;
    case "14" :
        res = '{"actionCode":"14","cvv2ResultsCode":"'+cvv2ResultsCode+'","errorCode":"ISE40001"}' ;
        break;
     case "954" :
        res = '{"actionCode":"96","cvv2ResultsCode":"'+cvv2ResultsCode+'","errorCode":"ISE40504"}' ;
        break;    
    
}

if(checkIfEmpty(res)){
            res = '{"actionCode":"96","cvv2ResultsCode":"'+cvv2ResultsCode+'","errorCode":"ISE40504"}' ;
}


function checkIfEmpty(field) {
    return field === null || field === undefined || field === "";
}

context.setVariable("response.content",res);
context.setVariable("response.header.Content-Type","application/json");