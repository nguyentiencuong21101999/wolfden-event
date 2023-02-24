import crypto from 'crypto'
import { config } from '../configs'

const algorithm = 'aes-256-ctr'
const iv = crypto.randomBytes(16)

export const encrypt = (text: string) => {
    const cipher = crypto.createCipheriv(algorithm, config.secretKey, iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
    return iv.toString('hex') + '.' + encrypted.toString('hex')
}

export const decrypt = (hash: string) => {
    const data = hash.split('.')
    if (data.length == 2) {
        const iv = data[0]
        const msg = data[1]
        const decipher = crypto.createDecipheriv(
            algorithm,
            config.secretKey,
            Buffer.from(iv, 'hex')
        )
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(msg, 'hex')),
            decipher.final(),
        ])
        return decrypted.toString()
    }
    return null
}
