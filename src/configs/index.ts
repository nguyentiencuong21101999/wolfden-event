const env = process.env

export interface Config {
    port: string
    dbUri: string
    redisUri: string
    secretKey: string
}

export const config: Config = {
    port: env.PORT,
    dbUri: env.DB_URI,
    redisUri: env.REDIS_URI,
    secretKey: env.SECRET_KEY,
}

export const isProduction = env.NODE_ENV === 'production'
