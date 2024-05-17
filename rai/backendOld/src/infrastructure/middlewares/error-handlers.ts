// src/infrastructure/middlewares/errorHandlers.ts
import { ErrorRequestHandler } from 'express';

const errorHandlers: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
};

export default errorHandlers;
