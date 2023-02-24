import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { mailQueue } from './event-queue.service'

export const serverAdapter = new ExpressAdapter()

createBullBoard({
    queues: [
        new BullMQAdapter(mailQueue),
    ],
    serverAdapter: serverAdapter,
})

serverAdapter.setBasePath('/admin/queues')
