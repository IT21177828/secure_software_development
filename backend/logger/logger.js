import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import DailyRotateFile from "winston-daily-rotate-file";

// Get the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a daily rotate file transport for info logs (includes info and warn levels)
const infoTransport = new DailyRotateFile({
  filename: path.join(__dirname, "logs", "info-%DATE%.log"), // Log file location
  datePattern: "YYYY-MM-DD", // Daily log rotation
  zippedArchive: true, // Optional: Zip log files
  maxSize: "20m", // Maximum size of each log file
  maxFiles: "14d", // Keep logs for 14 days
  level: "info", // Capture 'info' and 'warn' level logs
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`; // Unstructured log format
    })
  ),
});

// Create a daily rotate file transport for error logs (only errors)
const errorTransport = new DailyRotateFile({
  filename: path.join(__dirname, "logs", "error-%DATE%.log"), // Log file location
  datePattern: "YYYY-MM-DD", // Daily log rotation
  zippedArchive: true, // Optional: Zip log files
  maxSize: "20m", // Maximum size of each log file
  maxFiles: "14d", // Keep logs for 14 days
  level: "error", // Only capture 'error' level logs
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`; // Unstructured log format
    })
  ),
});

// Create the logger
const logger = winston.createLogger({
  level: "info", // Minimum level of logging (this affects console or other transports if added)
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.simple() // Use simple format
  ),
  transports: [
    infoTransport, // Add info transport (logs info and warn)
    errorTransport, // Add error transport (logs errors only)
  ],
});

// Export the logger
export default logger;
