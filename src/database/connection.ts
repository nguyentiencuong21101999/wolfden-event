/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToInstance } from 'class-transformer'
import fs from 'fs'
import humps from 'humps'
import path from 'path'
import { QueryTypes, Transactionable } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { config, isProduction } from '../configs'
import { logger } from '../helpers/logger'

const MODULES_PATH = 'src/modules'
const SPROC_PATH = 'sprocs'

export const database = new Sequelize(config.dbUri, {
    dialect: 'mysql',
    benchmark: true,
    logging: (msg, timing) => {
        logger.info(`[${timing}ms]${msg.replace('Executed (default):', '')}`)
    },
    models: [
        path.dirname(__dirname) +
            '/modules/**/*.model' +
            (isProduction ? '.js' : '.ts'),
    ],
    pool: {
        max: 50,
        min: 0,
        idle: 10000,
        acquire: 60000,
    },
})

export interface CustomQueryOptions extends Transactionable {
    replacements?: unknown[]
    plain?: boolean
}

/** Execute raw query */
export const rawQuery = async <T extends object>(
    query: string,
    opts: CustomQueryOptions,
    Model: any
): Promise<T> => {
    const res = await database.query(query, {
        replacements: opts.replacements || [],
        type: QueryTypes.SELECT,
        plain: opts.plain || false,
        transaction: opts.transaction,
    })
    return plainToInstance<T, any>(Model, humps.camelizeKeys(res), {
        excludeExtraneousValues: true,
    }) as T
}

/** Initialize all stored procedure */
export const initProcs = async () => {
    try {
        let total = 0
        const folderPathArray = fs.readdirSync(MODULES_PATH)
        for (const folderPath of folderPathArray) {
            const dir = `${MODULES_PATH}/${folderPath}/${SPROC_PATH}`
            if (fs.existsSync(dir)) {
                total += await _execProcSqls(dir)
            }
        }
        logger.info(`Init ${total} sprocs completed!`)
    } catch (err) {
        logger.error(`Init stored procedure failed. ${err.message}.`)
        process.exit(1)
    }
}

const _execProcSqls = async (dir) => {
    const sqlFiles = fs.readdirSync(dir)
    let total = 0
    for (const sql of sqlFiles) {
        const filePath = path.join(dir, sql)
        const rawSql = fs.readFileSync(filePath).toString()
        const spName = sql.replace('.sql', '')
        if (rawSql && rawSql !== '') {
            const spType = dir.includes('function') ? 'FUNCTION' : 'PROCEDURE'
            await database.query(`DROP ${spType} IF EXISTS ${spName}`, {
                logging: false,
            })
            await database.query(rawSql.toString(), { logging: false })
            total += 1
        } else {
            throw Error(`${spName}.sql is empty or not existed.`)
        }
    }
    return total
}

/** Execute store procedure */
export const execProc = async <T extends object>(
    Model: any,
    procName: string,
    opts: CustomQueryOptions
): Promise<T> => {
    const params = opts.replacements || []
    const qs: string[] = []
    for (let i = 0; i < params.length; i++) {
        qs.push('?')
    }
    const queryStr = `CALL ${procName}(${qs.join(',')})`
    const [res] = await database.query(queryStr, {
        replacements: params,
        type: QueryTypes.SELECT,
        transaction: opts.transaction,
    })
    const obj: any[] = []
    for (const i in res) {
        obj.push(res[i])
    }
    if (opts.plain) {
        //logger.info(JSON.stringify(obj[0]))
        return plainToInstance(Model, humps.camelizeKeys(obj[0]), {
            excludeExtraneousValues: true,
        }) as T
    }
    //logger.info(JSON.stringify(obj))
    return plainToInstance(Model, humps.camelizeKeys(obj), {
        excludeExtraneousValues: true,
    }) as T
}
