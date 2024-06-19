import express, {Request, Response} from "express";
import config from "./config";
import RabbitMQClient from "./rabbitmq/client/client";

const app = express();

app.post('/message', async (req: Request, res: Response) => {
    await RabbitMQClient.produce(req.body);
});

app.listen(config.port, async () => {
    console.log(`Sever listening on port: ${config.port}`)
    await RabbitMQClient.initialize();
})