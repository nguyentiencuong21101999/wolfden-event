import { NextFunction, Request, Response } from 'express'
import { Errors } from '../../helpers/error'
import { UserRoleEnum } from '../users/models/user-role.model'
import { AuthService } from './auth.service'

export interface AuthRequest extends Request {
    userId: number
    uuid: string
    roleId: number
}

export class AuthMiddleWare {
    authService: AuthService

    constructor(authService: AuthService) {
        this.authService = authService
    }

    authorization = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const authHeader = req.headers['authorization']
            const [, token] = authHeader && authHeader.split(' ')
            if (token == null) {
                return next(Errors.Unauthorized)
            }
            const payload = await this.authService.verifyToken(token)
            req.userId = payload.userId
            req.roleId = payload.roleId
            req.uuid = payload.uuid
            next()
        } catch (error) {
            next(Errors.Unauthorized)
        }
    }

    authorizationIfNeeded = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const authHeader = req.headers['authorization']
            const [, token] = authHeader && authHeader.split(' ')
            if (token == null) {
                return next()
            }
            const payload = await this.authService.verifyToken(token)
            req.userId = payload.userId
            next()
        } catch (error) {
            next()
        }
    }

    checkAdminRole = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (req.roleId == UserRoleEnum.User) {
                throw Errors.InvalidRole
            }
            next()
        } catch (error) {
            next(Errors.InvalidRole)
        }
    }
}
