function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const errMessage = err.message || "Internal Server Error";

    if (err.errors && Array.isArray(err.errors)) {
        return res.status(400).json({
            success: false,
            message: err.message || "Validation error",
            errors: err.errors
        });
    }

    return res.status(statusCode).json({
        success: false,
        message: errMessage,
    });
}

module.exports = errorHandler;
