import { instanceToPlain, plainToInstance } from 'class-transformer'
import { ValidationError } from 'class-validator'
import { ErrorResp, Errors } from './error'

export const parseValidationError = (err: unknown) => {
    const validationErrs = err as ValidationError[]
    if (validationErrs.length == 0) {
        return err
    }
    if (validationErrs[0]?.contexts != null) {
        const errValues = Object.values(validationErrs[0].contexts)
        if (errValues.length > 0) {
            const errResp = plainToInstance(
                ErrorResp,
                instanceToPlain(errValues[0])
            )
            if (errResp.message != null) return errResp
        }
    }
    if (validationErrs[0]?.constraints != null) {
        const constraintValues = Object.values(validationErrs[0].constraints)
        if (constraintValues.length > 0) {
            return new ErrorResp(
                Errors.BadRequest.code,
                constraintValues[0],
                Errors.BadRequest.status
            )
        }
    }
    return Errors.BadRequest
}
