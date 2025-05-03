function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        message: err.message || 'Something went wrong!',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
}

module.exports = errorHandler;