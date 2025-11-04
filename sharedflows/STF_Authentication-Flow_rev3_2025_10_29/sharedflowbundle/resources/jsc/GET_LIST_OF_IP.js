try {
    var validIpList = context.getVariable("security.IP.IPList"); //List of valid IPs from KVM named IP_LIST
    var splitIPs = validIpList.split(",");
    
    var counter = 0;
    var ipCount = 100; //This is the number of rows in AC-WhitelistIPs
    
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
        counter++;
        
    }
} catch(err) {
    //throw "Invalid IP";
    throw err;
}
