try {
    var validIpList = context.getVariable('private.validIpList'); //List of valid IPs from KVM named IP_LIST
    var splitIPs = validIpList.split(",");
    //var ipCount = splitIPs.length;
    var counter = 0;
    var ipCount = 15; //This is the number of rows in AC-WhitelistIPs
    
    while(counter < ipCount) {
        // context.setVariable("ip"+ (counter + 1), splitIPs[counter]);
        if(counter < splitIPs.length)
          context.setVariable("ip"+ (counter + 1), splitIPs[counter]);
        else
          context.setVariable("ip"+ (counter + 1), splitIPs[splitIPs.length-1]);
        counter++;
    }
} catch(err) {
    throw "Invalid IP";
}
