
/**
 * @extends Error
 */
class ExtendableError extends Error {
    constructor({
        message, publicMessage, errors, status, isPublic, stack,
    }) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.publicMessage = publicMessage;
        this.errors = errors;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
        this.stack = stack;
        // Error.captureStackTrace(this, this.constructor.name);
    }
}

/**
 * Class representing an App error.
 * @extends ExtendableError
 */
class AppError extends ExtendableError {
    /**
     * Creates an App error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     */
    constructor({
        message,
        publicMessage,
        errors,
        stack,
        status = 500,
        isPublic = false,
    }) {
        super({
            message, publicMessage, errors, status, isPublic, stack,
        });
    }
}

module.exports = AppError;
