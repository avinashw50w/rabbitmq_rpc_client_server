import rabbitMQClient from "./server";

export default class MessageHandler {
    static async handle(data: any, replyTo: string, correlationId: string) {
        // do some operation on data
        await rabbitMQClient.produce(data, replyTo, correlationId);
    }
}