export default {
    port: 3000,
    rabbitMQ: {
        url: 'amqp://localhost',
        queues: {
            rpcQueue: 'rpc_queue'
        }
    }
}