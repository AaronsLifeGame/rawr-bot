const { getSpreadsheetData } = require('../sheets');

module.exports = {
  name: 'standings',
  description: "Displays overall drivers/constructors standings, or the selected driver's and team's points.",
  async execute(message, args) {
    const input = args.join(' ').toLowerCase(); // Get the category or search term

    try {
      // Fetch data
      const driverRows = await getSpreadsheetData('Drivers Championship!A4:E'); // Position, Gamertag, Team, Points, Discord
      const constructorRows = await getSpreadsheetData('Constructors Championship!A4:D'); // Position, Empty, Team Name, Points

      // Clean up the data by filtering out rows with missing values
      const validDriverRows = driverRows.filter(row => row[1] && row[3]); // Ensure valid data for drivers (Gamertag, Points)
      const validConstructorRows = constructorRows.filter(row => row[2] && row[3]); // Ensure valid data for constructors

      // Merge constructor teams (since each team spans two rows, we only take unique ones)
      const teamStandings = [];
      const teamDrivers = {}; // Stores drivers under each team
      const seenTeams = new Set();

      for (const row of validConstructorRows) {
        const teamName = row[2];
        const points = row[3];

        if (!seenTeams.has(teamName)) {
          seenTeams.add(teamName);
          teamStandings.push({ teamName, points, position: row[0] });
          teamDrivers[teamName] = []; // Initialize empty driver list
        }
      }

      // Sort constructor standings by points in descending order
      teamStandings.sort((a, b) => parseInt(b.points) - parseInt(a.points));

      // Associate drivers with their teams
      for (const row of validDriverRows) {
        if (teamDrivers[row[2]]) {
          teamDrivers[row[2]].push({
            name: row[1], // Driver Gamertag
            points: row[3],
            position: row[0]
          });
        }
      }

      // Function to format position with ordinal suffix
      function getOrdinalSuffix(position) {
        const j = position % 10,
              k = position % 100;
        if (j === 1 && k !== 11) return `${position}st`;
        if (j === 2 && k !== 12) return `${position}nd`;
        if (j === 3 && k !== 13) return `${position}rd`;
        return `${position}th`;
      }

      // If no input is provided, show user's standings
      if (!input) {
        const userRow = validDriverRows.find(row => row[4] === message.author.username);

        if (!userRow) {
          return message.reply('Could not find your points in the standings.');
        }

        const driverPosition = getOrdinalSuffix(parseInt(userRow[0]));
        const driverPoints = userRow[3];

        const team = teamStandings.find(t => t.teamName === userRow[2]);

        if (!team) {
          return message.reply(`You are in ${driverPosition} place with ${driverPoints} points, but your team could not be found.`);
        }

        const teamPosition = getOrdinalSuffix(parseInt(team.position));
        const teamPoints = team.points;

        const teammates = teamDrivers[team.teamName] || [];
        const teammateInfo = teammates
          .map(driver => `- ${driver.name} is in ${getOrdinalSuffix(driver.position)} place with ${driver.points} points.`)
          .join('\n');

        return message.reply(`Your team **${team.teamName}** is in ${teamPosition} place with ${teamPoints} points.\n${teammateInfo}`);
      }

      // If input is "drivers" or "constructors", show the full standings
      if (input === 'drivers') {
        const filteredDriverRows = validDriverRows.filter(row => row[3] && parseInt(row[3]) > 0);
        filteredDriverRows.sort((a, b) => parseInt(b[3]) - parseInt(a[3]));

        let result = '```' + '\n';
        result += `Pos | Driver                   | Points\n`;
        result += `----|--------------------------|-------\n`;

        filteredDriverRows.forEach((row, index) => {
          const rank = (index + 1).toString().padEnd(4);
          const driver = row[1].padEnd(24);
          const points = row[3].toString().padStart(6);
          result += `${rank}| ${driver} | ${points}\n`;
        });

        result += '```';
        return message.reply(result);
      }

      if (input === 'constructors') {
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
        return message.reply(result);
      }

      // If input is not "drivers" or "constructors", search for a driver or team
      const driver = validDriverRows.find(row => row[1]?.toLowerCase() === input || row[4]?.toLowerCase() === input);
      if (driver) {
        const driverPosition = getOrdinalSuffix(parseInt(driver[0]));
        const driverPoints = driver[3];

        const team = teamStandings.find(t => t.teamName === driver[2]);

        if (!team) {
          return message.reply(`${driver[1]} is in ${driverPosition} place with ${driverPoints} points, not currently in a team.`);
        }

        const teamPosition = getOrdinalSuffix(parseInt(team.position));
        const teamPoints = team.points;

        const teammates = teamDrivers[team.teamName] || [];
        const teammateInfo = teammates
          .map(d => `- ${d.name} is in ${getOrdinalSuffix(d.position)} place with ${d.points} points.`)
          .join('\n');

        return message.reply(`${team.teamName} is in ${teamPosition} place with ${teamPoints} points.\n${teammateInfo}`);
      }

      const team = teamStandings.find(t => t.teamName.toLowerCase() === input);
      if (team) {
        const teamPosition = getOrdinalSuffix(parseInt(team.position));
        const teamPoints = team.points;

        const teammates = teamDrivers[team.teamName] || [];
        const teammateInfo = teammates
          .map(d => `- ${d.name} is in ${getOrdinalSuffix(d.position)} place with ${d.points} points.`)
          .join('\n');

        return message.reply(`${team.teamName}** is in ${teamPosition} place with ${teamPoints} points.\n${teammateInfo}`);
      }

      return message.reply(`Could not find a driver or team named "${input}".`);
    } catch (error) {
      console.error(error);
      message.reply('Sorry, there was an error fetching the standings.');
    }
  },
};
