import { Channel } from "amqplib";

export default class Producer {
    constructor(private channel: Channel) {}

    async produceMessage(data: any, replyToQueue: string, correlationId: string) {
        this.channel.sendToQueue(replyToQueue, Buffer.from(JSON.stringify(data)), {
            correlationId,
        });
    }
}
