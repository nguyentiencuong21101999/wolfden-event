import { Expose } from 'class-transformer'

export class EmptyDTO {}
export class TotalDTO {
    @Expose()
    total: number
}
