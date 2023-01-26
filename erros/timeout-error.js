const InternalErrorMessages = require("../utils/internal-system-error-code");
const InternalSystemCodes = require("../utils/internal-system-codes");
class TimeoutError extends Error {
  constructor(operationName) {
    super();
    this.code = InternalErrorMessages.TIMEOUT;
    this.internalCode = InternalSystemCodes.TIMEOUT;
    this.message = `The operation ${operationName} has timed out`;
  }
}

module.exports = TimeoutError;
