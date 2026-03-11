import { createLogger, format, transports } from 'winston'
import * as path from 'path'

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
)

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: logFormat,
  defaultMeta: { service: 'evcart-backend' },
  transports: [
    new transports.File({
      filename: path.join(process.env.LOG_PATH || './logs', 'error.log'),
      level: 'error',
      maxsize: 10485760,
      maxFiles: 30,
    }),
    new transports.File({
      filename: path.join(process.env.LOG_PATH || './logs', 'warn.log'),
      level: 'warn',
      maxsize: 10485760,
      maxFiles: 30,
    }),
    new transports.File({
      filename: path.join(process.env.LOG_PATH || './logs', 'combined.log'),
      maxsize: 10485760,
      maxFiles: 30,
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  )
}

export default logger
