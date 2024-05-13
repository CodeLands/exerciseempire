"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandlers = function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
};
exports.default = errorHandlers;
