import logger from "../logger/logger.js";

export const logRequestDetails = (req, res, next) => {
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const method = req.method;
  const url = req.originalUrl;

  logger.info(`IP Address: ${ipAddress}, Method: ${method}, URL: ${url}`);

  // Call next middleware or route handler
  next();
};
