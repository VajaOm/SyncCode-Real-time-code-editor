import redis from 'redis';


const publisher = redis.createClient();
const subscriber = redis.createClient();

const publishToChannel = (channel, message) => {
    publisher.publish(channel, message);
};

const subscribeToChannel = (channel) => {
    subscriber.subscribe(channel);

    subscriber.on('message', (channel, message) => {
        console.log("Received message from channel: ", channel, " message is : ", message);
    });
};

export {
    publishToChannel,
    subscribeToChannel
};