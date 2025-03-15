const fs = require('fs');

// Ensure the logs folder exists
const logDir = '../logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

module.exports = (error) => {
  console.error('Error:', error);

  // Log errors to a file with a timestamp
  const logMessage = `${new Date().toISOString()} - Error: ${error}\n`;
  fs.appendFileSync(`${logDir}/errors.log`, logMessage);
};
