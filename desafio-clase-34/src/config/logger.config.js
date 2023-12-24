import winston from 'winston'

// definimos nuestros propios niveles de loggeo
const customWinstonLevels = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'magenta',
        fatal: 'red'
    }
}

winston.addColors(customWinstonLevels.colors)

export const createLogger = env => {
    if (env === 'PRODUCTION') {
        return winston.createLogger({
            levels: customWinstonLevels.levels, 
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.combine(
                        winston.format.colorize(), 
                        winston.format.simple() 
                    )
                }),
                new  winston.transports.File({
                    filename: 'errors.log',
                    level: 'error',
                    format: winston.format.combine(
                        winston.format.simple() 
                    )
                }),
            ]
        })
    } else if (env === 'DEVELOPMENT') {
        return winston.createLogger({
            levels: customWinstonLevels.levels,
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        // winston.format.timestamp(), // imprime la fecha y la hora de la impresion del log
                        winston.format.colorize(), 
                        winston.format.simple()
                    )
                })
            ]
        })
    }
}
