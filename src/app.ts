import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './configs'
import { database } from './database/connection'
import { handleError } from './helpers/error'
import { logger } from './helpers/logger'
import { serverAdapter } from './modules/queue/queue.service'
import { redisService } from './modules/redis/redis.service'

const app = express()
const port = config.port

// const sensitiveOutgoingReqUrl = new Set([
//     `${config.genwebUrl}/GWBetService/r/u/Login`,
// ])

// // Axios logger for outgoing request
// axios.interceptors.request.use((request) => {
//     const hideData = sensitiveOutgoingReqUrl.has(request.url)
//     return AxiosLogger.requestLogger(request, {
//         prefixText: 'Outgoing',
//         data: !hideData,
//     })
// })
// axios.interceptors.response.use((response) => {
//     return AxiosLogger.responseLogger(response, {
//         prefixText: 'Outgoing',
//     })
// })

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const statusMonitor = require('express-status-monitor')({ path: '' })
// const basicAuthMiddleware = expressBasicAuth({
//     challenge: true,
//     users: {
//         wolfden: config.basicAuthPassword,
//     },
// })

const run = async () => {
    await database.authenticate()
    await redisService.connect()

    app.set('trust proxy', true)
    // app.use(statusMonitor.middleware)
    // app.get('/status', basicAuthMiddleware, statusMonitor.pageRoute)
    app.use(cors())
    app.use(helmet())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(
        morgan('short', {
            skip: (req) => {
                return (
                    req.url.startsWith('/api/queues') ||
                    req.url.startsWith('/admin/queues') ||
                    req.url.startsWith('/healthcheck')
                )
            },
        })
    )

    app.use('/admin/queues', serverAdapter.getRouter())
    app.get('/healthcheck', async (req, res) => {
        res.send({ status: 'healthy' })
    })

    // tracing incoming requests

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        handleError(err, res)
    })

    app.listen(port, async () => {
        return logger.info(`Server is listening at port ${port}`)
    })
}

run().catch((e) => logger.error(e))
process.on('warning', (e) => logger.warn(e.stack))
