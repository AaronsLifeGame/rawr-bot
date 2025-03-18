const { getSpreadsheetData } = require('../sheets');

module.exports = {
  name: 'standings',
  description: 'Display the driver standings',
  async execute(message, args) {
    const input = args.join(' ').toLowerCase(); // Get the gamertag/Discord to search for

    try {
      const driverRows = await getSpreadsheetData('Drivers Championship!A4:E');
      const filteredRows = driverRows.filter(row => row[3] && parseInt(row[3]) > 0); // Exclude zero-point drivers

      filteredRows.sort((a, b) => parseInt(b[3]) - parseInt(a[3])); // Sort by points

      // Function to format position with ordinal suffix
      function getOrdinalSuffix(position) {
        const j = position % 10,
              k = position % 100;
        if (j === 1 && k !== 11) return `${position}st`;
        if (j === 2 && k !== 12) return `${position}nd`;
        if (j === 3 && k !== 13) return `${position}rd`;
        return `${position}th`;
      }

      // If input is provided, search for a specific driver
      if (input) {
        const driverIndex = filteredRows.findIndex(row => row[1].toLowerCase() === input || row[4].toLowerCase() === input); // Search by Gamertag or Discord

        if (driverIndex === -1) {
          return message.reply(`Driver "${input}" not found in the standings.`);
        }

        const driver = filteredRows[driverIndex];
        const position = getOrdinalSuffix(driverIndex + 1); // Get ordinal position
        return message.reply(`${driver[1]} is in ${position} place with ${driver[3]} points.`);
      }

      // Otherwise, show full standings
      let result = '```' + '\n';
      result += `Pos | Driver                   | Points\n`;
      result += `----|--------------------------|-------\n`;

      filteredRows.forEach((row, index) => {
        const rank = (index + 1).toString().padEnd(4);
        const driver = row[1].padEnd(24);
        const points = row[3].toString().padStart(6);
        result += `${rank}| ${driver} | ${points}\n`;
      });

      result += '```';
      message.reply(result);
    } catch (error) {
      console.error(error);
      message.reply('Sorry, there was an error fetching the standings.');
    }
  },
};
