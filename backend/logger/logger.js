import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import DailyRotateFile from "winston-daily-rotate-file";

// Get the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a daily rotate file transport for info logs (includes info and warn levels)
const infoTransport = new DailyRotateFile({
  filename: path.join(__dirname, "logs", "info-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
});

// Create a daily rotate file transport for error logs (only errors)
const errorTransport = new DailyRotateFile({
  filename: path.join(__dirname, "logs", "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
});

// Create the logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [infoTransport, errorTransport],
});

// Export the logger
export default logger;
