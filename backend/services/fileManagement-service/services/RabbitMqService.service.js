import amqplib from 'amqplib';
import { rabbitMqConfig } from '../config.js';

export class RabbitMqService {
    async connect() {
        try {
            const connection = await amqplib.connect(process.env.MESSAGE_BROKER_URL);
            const channel = await connection.createChannel();

            await channel.assertQueue(rabbitMqConfig.queue);
            console.log("connection successfull to rabbit mq");
            channel.consume(rabbitMqConfig.queue, (msg) => {
                if (msg !== null) {
                    console.log("Received : ", msg.content.toString());
                    channel.ack(msg);
                }
                else {
                    console.log("Consumer cancelled by server");
                }
            });
        } catch (error) {
            console.log("Error in connecting to the rabbitmq...");
            console.log(error.message);
        }
    }
}