import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const logger = new Logger('HTTP');

// Middleware: apunta cada petición con su código y lo que ha tardado
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // 'finish' salta cuando la respuesta ya se ha enviado
  res.on('finish', () => {
    const ms = Date.now() - start;
    logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });

  next(); // sigue con la petición
}
