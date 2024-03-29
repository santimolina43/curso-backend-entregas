import winston from 'winston'

// definimos nuestros propios niveles de loggeo
const customWinstonLevels = {
    levels: {
        fatal: 5,
        error: 4,
        warning: 3,
        info: 2,
        http: 1,
        debug: 0
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
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
                    filename: 'errors-pro.log',
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
                    level: 'info',
                    format: winston.format.combine(
                        // winston.format.timestamp(), // imprime la fecha y la hora de la impresion del log
                        winston.format.colorize(), 
                        winston.format.simple()
                    )
                }),
                new  winston.transports.File({
                    filename: 'errors-dev.log',
                    level: 'fatal',
                    format: winston.format.combine(
                        winston.format.simple() 
                    )
                }),
            ]
        })
    }
}
