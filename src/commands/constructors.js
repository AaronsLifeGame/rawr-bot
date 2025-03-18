const { getSpreadsheetData } = require('../sheets');

module.exports = {
  name: 'constructors',
  description: 'Display the constructors standings',
  async execute(message, args) {
    const input = args.join(' ').toLowerCase(); // Get the team or driver name to search for

    try {
      // Fetch data
      const driverRows = await getSpreadsheetData('Drivers Championship!A4:E'); // Position, Gamertag, Team, Points, Discord
      const constructorRows = await getSpreadsheetData('Constructors Championship!A4:D'); // Position, Empty, Team Name, Points

      // Clean up the data by filtering out rows with missing values
      const validDriverRows = driverRows.filter(row => row[1] && row[2] && row[3] && row[4]);
      const validConstructorRows = constructorRows.filter(row => row[0] && row[2] && row[3]);

      // Merge teams (since each team spans two rows, we only take unique ones)
      const teamStandings = [];
      const seenTeams = new Set();

      for (const row of validConstructorRows) {
        const position = row[0]; // Team position
        const teamName = row[2];
        const points = row[3];

        if (!seenTeams.has(teamName)) {
          seenTeams.add(teamName);
          teamStandings.push({ position, teamName, points });
        }
      }

      // Sort constructor standings by points in descending order
      teamStandings.sort((a, b) => parseInt(b.points) - parseInt(a.points));

      // Function to format position with ordinal suffix
      function getOrdinalSuffix(position) {
        const j = position % 10,
              k = position % 100;
        if (j === 1 && k !== 11) return `${position}st`;
        if (j === 2 && k !== 12) return `${position}nd`;
        if (j === 3 && k !== 13) return `${position}rd`;
        return `${position}th`;
      }

      // If input is provided, search for a specific driver or team
      if (input) {
        // Search for a team by name
        const teamIndex = teamStandings.findIndex(team => team.teamName.toLowerCase().trim() === input);

        if (teamIndex !== -1) {
          const team = teamStandings[teamIndex];
          const position = getOrdinalSuffix(teamIndex + 1);
          return message.reply(`Team ${team.teamName} is in ${position} place with ${team.points} points.`);
        }

        // If input doesn't match a team, check for driver by Gamertag or Discord name
        const driver = validDriverRows.find(row =>
          row[1]?.toLowerCase().trim() === input || row[4]?.toLowerCase().trim() === input
        );

        if (driver) {
          // Find the constructor (team) of the driver
          const teamIndexForDriver = teamStandings.findIndex(team => team.teamName.toLowerCase().trim() === driver[2]?.toLowerCase().trim());

          if (teamIndexForDriver !== -1) {
            const team = teamStandings[teamIndexForDriver];
            const teamPosition = getOrdinalSuffix(teamIndexForDriver + 1);
            return message.reply(`Driver ${driver[1]} is in team ${team.teamName}, which is in ${teamPosition} place with ${team.points} points.`);
          } else {
            return message.reply(`Driver ${driver[1]} is not associated with any team.`);
          }
        }

        return message.reply(`Could not find any driver or constructor matching "${input}".`);
      }

      // If no input, show full constructor standings
      let result = '```' + '\n';
      result += `Pos | Team                     | Points\n`;
      result += `----|--------------------------|-------\n`;

      teamStandings.forEach((team, index) => {
        const rank = (index + 1).toString().padEnd(3);
        const teamName = team.teamName.padEnd(24);
        const points = team.points.toString().padStart(6);
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
