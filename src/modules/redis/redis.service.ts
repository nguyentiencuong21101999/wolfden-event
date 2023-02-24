import { createClient, RedisClientType } from 'redis'
import { Config, config } from '../../configs'
import { logger } from '../../helpers/logger'

export class RedisService {
    conf: Config
    client: RedisClientType

    constructor(conf: Config) {
        this.conf = conf
        this.client = createClient({ url: this.conf.redisUri })
    }

    async connect() {
        await this.client.connect()
        logger.info('Redis connect successful!')
    }
}

export const redisService = new RedisService(config)
