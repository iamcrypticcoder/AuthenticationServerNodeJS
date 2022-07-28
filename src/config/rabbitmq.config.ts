import amqplib from "amqplib/callback_api";

export const connectRabbitMQ = async (done: (err: Error) => void) => {
    console.log('=========> CONNECTING TO RabbitMQ...')
    const AMQP_URL = 'amqp://guest:guest@localhost:5672/'
    const REMOTE_AMQP_URL = 'amqps://kmzpeqjv:vWdSJAyjZ0JipgLVSztbzoNZwZN_fjhU@armadillo.rmq.cloudamqp.com/kmzpeqjv'
    const AMQP_QUEUE_NAME = 'email_queue'
    amqplib.connect(REMOTE_AMQP_URL, async (err: Error, connection: amqplib.Connection) => {
        if (err) {
            console.error('Error connecting to RabbitMQ !')
            return done(err)
        }
        console.log('=========> CONNECTED TO RabbitMQ')

        // // Listener
        // connection.createChannel((err, channel1) => {
        //     channel1.assertQueue(AMQP_QUEUE_NAME, {  }, (err, ok) => {
        //         if (err) throw err
        //     })

        //     channel1.consume(AMQP_QUEUE_NAME, (msg) => {
        //         if (msg !== null) {
        //             console.log('Recieved:', msg.content.toString());
        //             channel1.ack(msg);
        //         } else {
        //             console.log('Consumer cancelled by server');
        //         }
        //     })
        // })

        // // Sender
        // connection.createChannel((err, channel2) => {
        //     channel2.assertQueue(AMQP_QUEUE_NAME, {  }, (err, ok) => {
        //         if (err) throw err
        //     })

        //     setInterval(() => {
        //         channel2.sendToQueue(AMQP_QUEUE_NAME,
        //             Buffer.from(JSON.stringify({
        //                 userId: 123456,
        //                 endingEmailId: 100,
        //                 issuedAt: Date.now()
        //             })))
        //     }, 1000)
        // })
    })
}
