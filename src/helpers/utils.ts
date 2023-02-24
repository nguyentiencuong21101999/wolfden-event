import { TransformFnParams } from 'class-transformer'

/** Transform 0/1 to true/false */
export const ToBoolean = (param: TransformFnParams) => {
    if (param?.value === 1) {
        return true
    } else if (param.value == 0) {
        return false
    }
    return param.value
}

/** Transform string to number */
export const ToNumber = (param: TransformFnParams) => {
    const number = Number(param.value)
    if (isNaN(number)) {
        return 0
    }
    return number
}

/** Transform to trim text */
export const ToTrim = (param: TransformFnParams) =>
    (param?.value as string)?.trim()

export const genFullName = (fn: string, mn: string, ln: string) => {
    const names = [fn]
    if (mn != null && mn != '') {
        names.push(mn)
    }
    names.push(ln)
    return names.join(' ')
}

export const genNickName = (fn: string, ln: string) => {
    const names = [fn]
    names.push(ln)
    return names.join(' ')
}

/** Transform to ISO date string */
export const ToISODateString = (param: TransformFnParams) => {
    if (param?.value) {
        const date = new Date(param.value)
        return date.toISOString()
    }
    return null
}

/** Transform to timestamp GenWeb */
export const ToTimeStampGW = (ts: string) => {
    const rpl = ts.replace('/Date(', '')
    const timestamp = rpl.split('+')
    const parseTimeToNumber = Number(timestamp[0])
    if (!isNaN(parseTimeToNumber)) {
        return parseTimeToNumber
    }
    return null
}

export const splitChunks = <T>(source: T[], size: number) => {
    const chunks: T[][] = []
    for (let i = 0; i < source.length; i += size) {
        chunks.push(source.slice(i, i + size))
    }
    return chunks
}

export const getFullDateAndTimeToDay = (timeParse?: Date) => {
    const today = timeParse ? timeParse : new Date()
    const date = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()
    const month =
        today.getMonth() + 1 < 10
            ? `0${today.getMonth() + 1}`
            : today.getMonth() + 1
    const year = today.getFullYear()
    const hour =
        today.getHours() < 10 ? `0${today.getHours()}` : today.getHours()
    const minute =
        today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes()

    const second =
        today.getSeconds() < 10 ? `0${today.getSeconds()}` : today.getSeconds()
    const day = `${month}/${date}/${year}`
    const time = `${hour}:${minute}:${second}`

    return { day, time }
}

export const removeFirstUrl = (text: string) => {
    const regex = new RegExp(
        '((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)',
        'g'
    )
    const firstUrl = text.match(regex)
    if (firstUrl) {
        const newText = text.replace(firstUrl[0], '')
        if (firstUrl.length == 1 && newText.length == 0) {
            return ' '
        }
        return newText
    } else {
        return text
    }
}

export const removeMention = (text: string) => {
    const regex = new RegExp('@[A-Za-z0-9_.-]*', 'g')
    let newText = text
    const mention = text.match(regex)
    if (mention && mention.length > 0) {
        for (let i = 0; i < mention.length; i++) {
            const textLength = mention[i].length
            if (textLength >= 2 && textLength <= 33) {
                newText = newText.replace(mention[i], '')
            }
        }
        if (mention.length == 1 && newText.length == 0) {
            return ' '
        }
    }
    return newText
}
