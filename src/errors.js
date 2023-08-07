//this module defines constants to be used when throwing and handling errors
class errUnauthorized extends Error {
    constructor(message) {
        super(message);
        this.name = "Unauthorized";
    }
}

class errBadRequest extends Error {
    constructor(message) {
        super(message);
        this.name = "Bad request";
    }
}

class errMaxQuota extends Error {
    constructor(message) {
        super(message);
        this.name = "Maximum quota reached";
    }
}

class errRateLimit extends Error {
    constructor(message) {
        super(message);
        this.name = "Rate limit exceeded";
    }
}

class errInternal extends Error {
    constructor(message) {
        super(message);
        this.name = "Internal error";
    }
}

class errUnknown extends Error {
    constructor(message) {
        super(message);
        this.name = "Unknown error";
    }
}

module.exports = {errUnauthorized, errBadRequest, errMaxQuota, errRateLimit, errInternal, errUnknown}