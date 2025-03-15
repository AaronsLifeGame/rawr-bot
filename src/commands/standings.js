const { getSpreadsheetData } = require('../sheets');

module.exports = {
  name: 'standings',
  description: 'Display the driver standings',
  async execute(message, args) {
    const input = args.join(' ').toLowerCase(); // Get the gamertag/Discord to search for

    try {
      const driverRows = await getSpreadsheetData('Drivers Championship!B4:E');
      const filteredRows = driverRows.filter(row => row[2] && parseInt(row[2]) > 0); // Exclude zero-point drivers

      filteredRows.sort((a, b) => parseInt(b[2]) - parseInt(a[2])); // Sort by points

      // If input is provided, search for a specific driver
      if (input) {
        const driver = filteredRows.find(row => row[0].toLowerCase() === input || row[3].toLowerCase() === input); // Search by Gamertag or Discord

        if (!driver) {
          return message.reply(`Driver "${input}" not found in the standings.`);
        }

        return message.reply(`${driver[0]} has ${driver[2]} points.`);
      }

      // Otherwise, show full standings
      let result = '```' + '\n';
      result += `Pos | Driver                   | Points\n`;
      result += `----|--------------------------|-------\n`;

      filteredRows.forEach((row, index) => {
        const rank = (index + 1).toString().padEnd(3);
        const driver = row[0].padEnd(24);
        const points = row[2].toString().padStart(6);
        result += `${rank} | ${driver} | ${points}\n`;
      });

      result += '```';
      message.reply(result);
    } catch (error) {
      console.error(error);
      message.reply('Sorry, there was an error fetching the standings.');
    }
  },
};
