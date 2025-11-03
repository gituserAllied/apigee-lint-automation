try{
    var responseContent = context.getVariable("back_end_response");
    context.setVariable("message.content",responseContent);
    kafka_status = context.getVariable("servicecallout.SC-CompositeKafka.failed");
    context.setVariable("kafka_status",kafka_status);
}catch(err){
     context.setVariable("CATCH_EXCEPTION", "JS-SetBackendResponse error: " + err);
}