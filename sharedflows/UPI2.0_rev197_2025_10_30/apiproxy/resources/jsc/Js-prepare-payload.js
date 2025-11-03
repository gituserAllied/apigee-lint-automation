// set prod and channel ID
var ProductId1="";
var ChannelId1="";
ProductId1=context.getVariable("request.header.ProductId")?context.getVariable("request.header.ProductId"):context.getVariable("request.header.ProductID");
ChannelId1=context.getVariable("request.header.ChannelId")?context.getVariable("request.header.ChannelId"):context.getVariable("request.header.ChannelID");
context.setVariable("ProductId1", ProductId1);
context.setVariable("ChannelId1", ChannelId1);