const { google } = require('googleapis');
const path = require('path');
const { SHEET_ID } = process.env;

async function getSpreadsheetData(range) {
  // Use GoogleAuth for authentication
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../credentials.json'), // "airy-galaxy-325723-bcc7a7bc4b85.json"
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: range,
    });
    return res.data.values; // Return the data from the sheet
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}

module.exports = { getSpreadsheetData };
