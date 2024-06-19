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
            const {queue: rpcQueue} = await this.consumerChannel.assertQueue(config.rabbitMQ.queues.rpcQueue);

            this.producer = new Producer(this.producerChannel);
            this.consumer = new Consumer(this.consumerChannel, rpcQueue);

            this.consumer.consumeMessages();

            this.isInitialized = true;
        } catch (err: any) {
            console.log('rabbitmq error', err);
        }
    }

    async produce(data: any, replyTo: string, correlationId: string) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return await this.producer.produceMessage(data, replyTo, correlationId);
    }
}

export default RabbitMQClient.getInstance();