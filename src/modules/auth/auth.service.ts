import { instanceToPlain, plainToInstance } from 'class-transformer'
import jwt from 'jsonwebtoken'
import { Config } from '../../configs'
import { Errors } from '../../helpers/error'
import { RedisService } from '../redis/redis.service'
const WD_ACCESS_TOKEN_KEY = 'wd_access_token'
const WD_BLACKLIST_TOKEN_KEY = 'wd_blacklist_token'
const WD_ACCOUNT_POSITION_KEY = 'wd_account_position_key'

export class AuthPayload {
    userId: number
    uuid: string
    roleId: number
}
export class AuthService {
    conf: Config
    redis: RedisService

    constructor(conf: Config, redisService: RedisService) {
        this.conf = conf
        this.redis = redisService
    }

    async signToken(userId: number, uuid: string, roleId: number) {
        const sign = jwt.sign(
            {
                userId: userId.toString(),
                uuid: uuid,
                roleId: roleId.toString(),
            },
            this.conf.secretKey
        )
        await this.addAccessToken(userId, sign)
        return sign
    }

    async verifyToken(token: string) {
        const decoded = jwt.verify(token, this.conf.secretKey, {
            complete: true,
        })

        const authPayload = plainToInstance(
            AuthPayload,
            instanceToPlain(decoded.payload)
        )

        const tokens = await this.getAccessTokens(authPayload.userId)
        if (!tokens.has(token)) {
            throw Errors.Unauthorized
        }
        return authPayload
    }

    async setToken(key: string, hash: string, token: string) {
        await this.redis.client.hSet(key, hash, token)
    }

    async getAccessTokens(userId: number) {
        const res = await this.redis.client.hGet(
            WD_ACCESS_TOKEN_KEY,
            userId.toString()
        )
        if (res != null) {
            return new Set(res.split(','))
        }
        return new Set()
    }

    async addAccessToken(userId: number, token: string) {
        const tokens = await this.getAccessTokens(userId)
        tokens.add(token)
        await this.setToken(
            WD_ACCESS_TOKEN_KEY,
            userId.toString(),
            [...tokens].join(',')
        )
    }

    async removeAccessToken(userId: number, token: string) {
        const tokens = await this.getAccessTokens(userId)
        tokens.delete(token)
        await this.setToken(
            WD_ACCESS_TOKEN_KEY,
            userId.toString(),
            [...tokens].join(',')
        )
    }

    async removeAllAccessTokens(userId: number) {
        await this.setToken(WD_ACCESS_TOKEN_KEY, userId.toString(), '')
    }

    async invalidateToken(token: string) {
        await this.setToken(WD_BLACKLIST_TOKEN_KEY, token, '')
    }

    async isInvalidToken(token: string) {
        return new Promise<boolean>((resolve, reject) => {
            this.redis.client
                .hExists(WD_BLACKLIST_TOKEN_KEY, token)
                .then((val) => resolve(val))
                .catch((err) => reject(err))
        })
    }
}
