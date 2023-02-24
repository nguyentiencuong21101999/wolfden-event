import { Request } from 'express'

export interface BodyRequest<T> extends Request {
    userId: number
    uuid: string
    roleId: number
    body: T
}

export interface MediaBodyRequest<T> extends BodyRequest<T> {
    fileUrl: string
}
