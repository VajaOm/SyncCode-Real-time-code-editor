import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';
import { RabbitMqService } from './services/RabbitMqService.service.js';

const noOfCpus = os.cpus().length;

dotenv.config();

if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);

    for (let i = 0; i < noOfCpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} exited. Forking a new worker`);
        cluster.fork();
    });
}

else {
    function startWorker() {
        console.log(`Worker process ${process.pid} is running and listening for messages...`);
        const rabbitmqService = new RabbitMqService();
        rabbitmqService.connect();
    }

    startWorker();
}