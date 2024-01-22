import { logger } from "../app.js";
import EErros from "../services/errors/enums.js";

// este es un middleware que segun el tipo de error envia un mensaje personalizado
export default(error, req, res, next) => {
    logger.info('middleware errores')
    logger.error(error.cause)

    switch (error.code) {
        case EErros.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.name})
            break;
        default:
            res.send({ status: 'error', error: 'Unhandled error'})
            break;
    }
}