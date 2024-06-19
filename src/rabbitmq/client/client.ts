import { Channel, Connection, connect } from "amqplib";
import Consumer from "./consumer";
import Producer from "./producer";
import config from "../../config";

class RabbitMQClient {
    private producer: Producer;
    private consumer: Consumer;
    private connection: Connection;
    private producerChannel: Channel;
    private consumerChannel: Channel;

    private static instance: RabbitMQClient;

    private isInitialized: boolean;

    private constructor() {}
    
    public static getInstance() {
        if (!this.instance) {
            this.instance = new RabbitMQClient();
        }
        return this.instance;
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }
        try {
            this.connection = await connect(config.rabbitMQ.url);

            this.producerChannel = await this.connection.createChannel();
            this.consumerChannel = await this.connection.createChannel();

            // exclusive queues are deleted if rabbitmq connection is closed
            const {queue: replyQueueName} = await this.consumerChannel.assertQueue('', {exclusive: true});

            this.producer = new Producer(this.producerChannel, replyQueueName);
            this.consumer = new Consumer(this.consumerChannel, replyQueueName);

            this.consumer.consumeMessages();

            this.isInitialized = true;
        } catch (err: any) {
            console.log('rabbitmq error', err);
        }
    }

    async produce(data: any) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return await this.producer.produceMessage(data);
    }
}

export default RabbitMQClient.getInstance();