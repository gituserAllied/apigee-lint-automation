try {
    var validIpList = context.getVariable('validIpList'); //List of valid IPs from KVM named IP_LIST
    var splitIPs = validIpList.split(",");
    
    var counter = 0;
    var ipCount = 85; //This is the number of rows in AC-WhitelistIPs
    
    while(counter < ipCount) {
        var ipAndMask = splitIPs[splitIPs.length-1].split("/");
        var masking = '32';
        if(counter < splitIPs.length) {
            ipAndMask = splitIPs[counter].split("/");
        }
        if(ipAndMask[1] && ipAndMask[1].trim()) {
           masking =  ipAndMask[1].trim();
        }
        context.setVariable("ip"+ (counter + 1), ipAndMask[0].trim());
        context.setVariable("ipmask"+ (counter + 1), masking);
        counter++;
        
    }
    // if(counter >= ipCount){
                // var currentIps = context.getVariable("request.header.true-client-ip")?context.getVariable("request.header.true-client-ip"):context.getVariable("request.header.X-Forwarded-For");
                // var currentIps=context.getVariable("proxy.client.ip");
                // for(var i = 0; i < splitIPs.length ; i++){
                //     if (splitIPs[i].trim()===currentIps.trim()){
                //         context.setVariable("ip1" , splitIPs[i].trim());
                //          break;
                //     }   
                // }
             
            // }
} catch(err) {
    //throw "Invalid IP";
    throw err;
}
