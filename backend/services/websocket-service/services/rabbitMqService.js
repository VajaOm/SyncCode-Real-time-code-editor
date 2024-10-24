import amqplib from 'amqplib';
import { rabbitMqConfig } from '../config.js';

export class RabbitMqService {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    // Establish connection to RabbitMQ
    async connect() {
        try {
            this.connection = await amqplib.connect(process.env.MESSAGE_BROKER_URL);
            this.channel = await this.connection.createChannel();

            // Ensure the queue exists before we start using it
            await this.channel.assertQueue(rabbitMqConfig.queue);
            console.log("Connection successful to RabbitMQ");
        } catch (error) {
            console.log("Error in connecting to RabbitMQ...");
            console.log(error.message);
            throw new Error('Failed to connect to RabbitMQ');
        }
    }

    // Send data onto RabbitMQ queue
    async uploadDataOntoQueue(data) {
        try {
            if (!this.channel) {
                throw new Error("Channel not initialized");
            }

            // Convert the data to Buffer as RabbitMQ requires binary format
            const bufferData = Buffer.from(JSON.stringify(data));

            // Send the serialized data to the queue
            await this.channel.sendToQueue(rabbitMqConfig.queue, bufferData);
            console.log("Data sent to queue:", rabbitMqConfig.queue);
        } catch (error) {
            console.log("Error in sending data to the queue:", error.message);
            throw new Error('Failed to upload data to queue');
        }
    }

    // Close connection when done
    async closeConnection() {
        try {
            if (this.channel) await this.channel.close();
            if (this.connection) await this.connection.close();
            console.log("RabbitMQ connection closed.");
        } catch (error) {
            console.log("Error while closing RabbitMQ connection:", error.message);
        }
    }
}
