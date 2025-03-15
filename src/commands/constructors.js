const { getSpreadsheetData } = require('../sheets');

module.exports = {
  name: 'constructors',
  description: 'Display the constructors standings',
  async execute(message, args) {
    const input = args.join(' ').toLowerCase(); // Get the team or driver name to search for

    try {
      // Fetch data
      const driverRows = await getSpreadsheetData('Drivers Championship!B4:E'); // Gamertag, Driver, Points, Discord
      const constructorRows = await getSpreadsheetData('Constructors Championship!B4:D'); // Team Name, Points

      // Clean up the data by filtering out rows with missing values
      const validDriverRows = driverRows.filter(row => row[0] && row[1] && row[2] && row[3]);
      const validConstructorRows = constructorRows.filter(row => row[1] && row[2]);

      // If input is provided, search for a specific driver or team
      if (input) {
        // Check if the input matches a team name
        const team = validConstructorRows.find(row => row[1]?.toLowerCase().trim() === input);

        if (team) {
          return message.reply(`Team ${team[1]} has ${team[2]} points.`);
        }

        // If input doesn't match a team, check for driver by Gamertag or Discord name
        const driver = validDriverRows.find(row => 
          row[0]?.toLowerCase().trim() === input || row[3]?.toLowerCase().trim() === input
        );

        if (driver) {
          // Find the constructor (team) of the driver
          const driverTeam = validConstructorRows.find(row => row[1]?.toLowerCase().trim() === driver[1]?.toLowerCase().trim());

          if (driverTeam) {
            return message.reply(`Driver ${driver[0]} is in team ${driverTeam[1]} with ${driverTeam[2]} points.`);
          } else {
            return message.reply(`Driver ${driver[1]} is not associated with any team.`);
          }
        }

        return message.reply(`Could not find any driver or constructor matching "${input}".`);
      }

      // If no input, show full constructor standings
      validConstructorRows.sort((a, b) => parseInt(b[2]) - parseInt(a[2])); // Sort by points in descending order

      let result = '```' + '\n';
      result += `Pos | Team                   | Points\n`;
      result += `----|------------------------|-------\n`;

      validConstructorRows.forEach((row, index) => {
        const rank = (index + 1).toString().padEnd(3);
        const teamName = row[1].padEnd(24);
        const points = row[2].toString().padStart(6);
        result += `${rank} | ${teamName} | ${points}\n`;
      });

      result += '```';
      message.reply(result);
    } catch (error) {
      console.error(error);
      message.reply('Sorry, there was an error fetching the constructors standings.');
    }
  },
};
