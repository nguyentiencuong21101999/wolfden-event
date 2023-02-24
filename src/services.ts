import { config } from './configs'
import { AuthMiddleWare } from './modules/auth/auth.middleware'
import { AuthService } from './modules/auth/auth.service'
import { redisService } from './modules/redis/redis.service'

export const authService = new AuthService(config, redisService)
export const authMiddleware = new AuthMiddleWare(authService)
