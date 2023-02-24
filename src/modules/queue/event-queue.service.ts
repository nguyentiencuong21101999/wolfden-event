import { Queue, QueueScheduler, Worker } from 'bullmq'
import IORedis from 'ioredis'
import { config } from '../../configs'

export const EventScanQueueName = 'event-scan'

const ioRedis = new IORedis(config.redisUri, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
})

export const myQueueScheduler = new QueueScheduler(EventScanQueueName, {
    autorun: true,
    connection: ioRedis,
})

export const mailQueue = new Queue(EventScanQueueName, {
    connection: ioRedis,
    defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: 1000,
    },
})

export const mailWorker = new Worker(EventScanQueueName, async (job) => {}, {
    connection: ioRedis,
})
