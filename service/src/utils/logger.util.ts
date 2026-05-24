import winston from "winston";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    success: 2, // Custom level
    info: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    success: 'green',
    info: 'blue',
    debug: 'gray',
  },
};

// Tell Winston about your custom colors
winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels, // Use your custom levels
  level: 'debug', // The minimum level to capture
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((info) => {
      // Custom string format for the logs
      return `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }), // Colorize the whole line
        winston.format.simple()
      ),
    }),
    // Save only errors to a file
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Save everything to a combined file
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger