const amqp = require("amqplib");

const consumeMessageFromQueue = async () => {
  try {
    // connect to cloud or a locally running rabbitmq process
    const connectionString = process.env.CONNECTION_STRING || "amqp://localhost:5672";
    const connection = await amqp.connect(connectionString);
    const channel = await connection.createChannel();
    
    const queueName = "factorial";
    await channel.assertQueue(queueName);

    channel.consume(queueName, (msg) => {
      const msgData = JSON.parse(msg.content.toString());
      console.log(`CONSUMED TASK": ${msgData.id}`);

      // some complex processing that takes time
      const n = factorial(Number(msgData.n));
      
      console.log(`FACTORIAL OF ${msgData.n} is ${n}`);
      
      channel.ack(msg); // send back to the rabbitMQ server that we handled the task, so it removes it from queue
    });

  } catch (error) {
    console.error("ERROR:", error)
  }
}

consumeMessageFromQueue();

const factorial = (n) => {
  if(n < 0) return -1;
  if(n === 0) return 1;
  return n * factorial(n-1);
}
