var proxy_name = context.getVariable("apiproxy.name");
var developer_app_name = context.getVariable("developer.app.name");

if(developer_app_name == null || developer_app_name == undefined || developer_app_name =="")
{
    context.setVariable("key_identifier","");
}
else
{
    context.setVariable("key_identifier",developer_app_name+"#"+proxy_name);
}
