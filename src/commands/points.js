const { getSpreadsheetData } = require('../sheets');

module.exports = {
  name: 'points',
  description: 'Get the total points of a driver or a team',
  async execute(message, args) {
    const input = args.join(' '); // Get gamertag or Discord username from message arguments

    try {
      const driverRows = await getSpreadsheetData('Drivers Championship!B4:E'); // Get Gamertag, Driver, Points, Discord
      const constructorRows = await getSpreadsheetData('Constructors Championship!C4:D'); // Get Team Name, Points

      // If no input is provided, show user's points (based on Discord username)
      if (!input) {
        const userRow = driverRows.find(row => row[3] === message.author.username); // Check if Discord username matches

        if (!userRow) {
          return message.reply('Could not find your points in the standings.');
        }

        return message.reply(`Your points: ${userRow[2]}`);
      }

      // Find driver by Discord or gamertag
      const driver = driverRows.find(row => row[3].toLowerCase() === input.toLowerCase() || row[0].toLowerCase() === input.toLowerCase());

      if (driver) {
        return message.reply(`${driver[0]} has ${driver[2]} points.`);
      }

      // If not found, check constructors for team points
      const constructor = constructorRows.find(row => row[0].toLowerCase() === input.toLowerCase());

      if (constructor) {
        return message.reply(`Team ${constructor[0]} has ${constructor[1]} points.`);
      }

      message.reply(`Could not find any driver or team matching "${input}".`);
    } catch (error) {
      console.error(error);
      message.reply('Sorry, there was an error fetching the points.');
    }
  },
};
