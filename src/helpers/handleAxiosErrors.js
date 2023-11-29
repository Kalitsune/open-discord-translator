const error = require("../errors");

function handleAxiosErrors(response) {
    if (response.data.error) {
        console.log(response.data.error.status);
        //catch errors and bind them to an existing error class
        if (["UNAUTHENTICATED", "PERMISSION_DENIED"].includes(response.data.error.status)) {
            throw new error.errUnauthorized(response.data.error.message);
        } else if (["Daily Limit Exceeded", "User Rate Limit Exceeded", "Quota Exceeded"].includes(response.data.error.message)) {
            throw new error.errMaxQuota(response.data.error.message);
        } else if (["Rate Limit Exceeded"].includes(response.data.error.message)) {
            throw new error.errRateLimit(response.data.error.message);
        } else if (["INVALID_ARGUMENT", "FAILED_PRECONDITION", "OUT_OF_RANGE", "UNIMPLEMENTED", "INTERNAL", "UNAVAILABLE", "DATA_LOSS"].includes(response.data.error.status)){
            throw new error.errBadRequest(response.data.error.message);
        } else {
            throw new error.errUnknown(response.data.error.message);
        }
    }
}

module.exports = handleAxiosErrors;