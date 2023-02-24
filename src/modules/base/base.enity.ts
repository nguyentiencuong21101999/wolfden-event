 import sequelize, { DataTypes } from 'sequelize'
import {
    Column,
    CreatedAt,
    Default,
    DefaultScope,
    Model,
    UpdatedAt,
} from 'sequelize-typescript'

@DefaultScope(() => ({
    attributes: { exclude: ['createdBy', 'updatedBy'] },
}))
export abstract class BaseModel<T> extends Model<T> {
    @Default(1)
    @Column({ type: DataTypes.INTEGER, field: 'CreatedBy' })
    createdBy: number

    @CreatedAt
    @Default(sequelize.literal('CURRENT_TIMESTAMP'))
    @Column({ field: 'CreatedDate' })
    createdDate: Date

    @Column({ type: DataTypes.INTEGER, field: 'UpdatedBy' })
    updatedBy: number

    @UpdatedAt
    @Default(sequelize.literal('CURRENT_TIMESTAMP'))
    @Column({ field: 'UpdatedDate' })
    updatedDate: Date
}
