const { getSpreadsheetData } = require('../sheets');

module.exports = {
  name: 'points',
  description: 'Get the total points of a driver or a team',
  async execute(message, args) {
    const input = args.join(' '); // Get gamertag or Discord username from message arguments

    try {
      const driverRows = await getSpreadsheetData('Drivers Championship!A4:E'); // Get Position, Gamertag, Points, Discord
      const constructorRows = await getSpreadsheetData('Constructors Championship!A4:D'); // Get Position, Team Name, Points

      // Function to format position with ordinal suffix
      function getOrdinalSuffix(position) {
        const j = position % 10,
              k = position % 100;
        if (j === 1 && k !== 11) return `${position}st`;
        if (j === 2 && k !== 12) return `${position}nd`;
        if (j === 3 && k !== 13) return `${position}rd`;
        return `${position}th`;
      }

      // If no input is provided, show user's points (based on Discord username)
      if (!input) {
        const userRow = driverRows.find(row => row[4] === message.author.username); // Check if Discord username matches

        if (!userRow) {
          return message.reply('Could not find your points in the standings.');
        }

        const position = getOrdinalSuffix(parseInt(userRow[0]));
        return message.reply(`You have ${userRow[3]} points and are in ${position} place.`);
      }

      // Find driver by Discord or gamertag
      const driver = driverRows.find(row => row[4]?.toLowerCase() === input.toLowerCase() || row[1]?.toLowerCase() === input.toLowerCase());

      if (driver) {
        const position = getOrdinalSuffix(parseInt(driver[0]));
        return message.reply(`${driver[1]} has ${driver[3]} points and is in ${position} place.`);
      }

      // If not found, check constructors for team points
      for (let i = 0; i < constructorRows.length; i += 2) { // Skip every second row since teams are merged
        const teamRow = constructorRows[i]; // Only check the first row of each team entry
        if (teamRow[2]?.toLowerCase() === input.toLowerCase()) {
          const position = getOrdinalSuffix(parseInt(teamRow[0]));
          return message.reply(`Team ${teamRow[2]} has ${teamRow[3]} points and is in ${position} place.`);
        }
      }

      message.reply(`Could not find any driver or team matching "${input}".`);
    } catch (error) {
      console.error(error);
      message.reply('Sorry, there was an error fetching the points.');
    }
  },
};
