import winston from 'winston';

// Create logger instance with different levels and file transports
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // // Log to console always
        // new winston.transports.Console({
        //     format: winston.format.combine(
        //         winston.format.colorize(), // Add color to console output
        //         winston.format.printf(({ timestamp, level, message }) => {
        //             return `${timestamp} [${level}]: ${message}`;
        //         })
        //     )
        // }),

        // Log all levels to combined.log
        new winston.transports.File({ filename: 'logs/combined.log' }),

        // Log only errors to error.log
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
});

export default logger;
