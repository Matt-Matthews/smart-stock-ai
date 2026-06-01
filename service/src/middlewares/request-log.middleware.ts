import type { Request, Response, NextFunction } from 'express';
import EventEmitter from 'events';
import logger from '@utils/logger.util.js';
import {v4 as uuidv4} from 'uuid';
import createRequestLogService from '@services/requestlogs/create-requet-log.service.js';

const eventEmitter = new EventEmitter();

eventEmitter.on('requestLogged', async (data) => {

    const log = await createRequestLogService(data);

    logger.debug(`Request log creation result: ${log.status} - ${log.message}`);
});

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, url } = req;
    const requestId = uuidv4();
    logger.info(`Incoming Request: ${method} ${url} - Request ID: ${requestId}`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        const data = {
            method: method,
            direction: 'inbound',
            endpoint: url,
            status_code: statusCode,
            duration: duration,
            request_timestamp: start,
            response_timestamp: Date.now(),
            request_headers: req.headers || {},
            response_headers: res.getHeaders() || {},
            response_body: res.locals?.body ? res.locals.body : {},
            request_body: req.body || {},
            request_id: requestId,
            user_id: req.user ? req.user.id : null,
        }
        eventEmitter.emit('requestLogged', data);
        logger.info(`Completed Request: ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms - Request ID: ${requestId}`);
    });

    res.on('error', (err) => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        const data = {
            method: method,
            direction: 'inbound',
            endpoint: url,
            status_code: statusCode,
            duration: duration,
            request_timestamp: start,
            response_timestamp: Date.now(),
            request_headers: req.headers || {},
            response_headers: res.getHeaders() || {},
            response_body: res.locals?.body ? res.locals.body : {},
            request_body: req.body || {},
            request_id: requestId,
            error_message: err.message,
        }
        eventEmitter.emit('requestLogged', data);
        logger.error(`Error occurred while processing request: ${err.message}`);
    });

    next();
};

export default requestLogger;