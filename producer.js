const amqp = require("amqplib");

const connectAndAddMessageToQueue = async () => {
  let connection;
  let channel;
  try {
    
    // connect to rabbitmq server through the amqp protocol throw TCP, create channel
    
    // connect to cloud or a locally running rabbitmq process
    const connectionString = process.env.CONNECTION_STRING || "amqp://localhost:5672";

    connection = await amqp.connect(connectionString);
    channel = await connection.createChannel();
    
    // create a queue, send a message
    const queueName = "factorial";
    let id = Math.random();
    const message = {id, n:100}; // calculate factorial of 5;
    await channel.assertQueue(queueName);
    const isSent = await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log("isSent", isSent);
    if(isSent) {
      console.log(`SUCCESS: message with Id: ${id} is added to queue`)
    } else {
      console.log(`FAIL: message with Id: ${id} is NOT added to queue`)
    }
  } catch (error) {
    console.error("ERROR:", error)
  } finally {
    await channel.close();
    await connection.close();
  }
}
connectAndAddMessageToQueue();