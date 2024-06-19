import { Channel, ConsumeMessage } from "amqplib";

export default class Consumer {

    constructor(private channel: Channel, private replyQueueName: string) {}

    async consumeMessages() {
        console.log('ready to consume messages...');
        this.channel.consume(this.replyQueueName, (message: ConsumeMessage | null) => console.log(message?.content.toString()), {
            noAck: true
        });
    }
}