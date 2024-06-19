import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from "./messageHandler";

export default class Consumer {
    constructor(private channel: Channel, private rpcQueue: string) {}

    async consumeMessages() {
        console.log("ready to consume messages...");
        this.channel.consume(
            this.rpcQueue,
            async (message: ConsumeMessage | null) => {
                const messageProps = message?.properties;
                if (!messageProps?.correlationId || !messageProps?.replyTo) {
                    console.log("missing properties");
                } else {
                    const { replyTo, correlationId } = messageProps;
                    const msg = message?.content ? JSON.parse(message.content.toString()) : null;
                    await MessageHandler.handle(msg, replyTo, correlationId);
                }
            },
            {
                noAck: true,
            }
        );
    }
}
