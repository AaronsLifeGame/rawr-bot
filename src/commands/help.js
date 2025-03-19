module.exports = {
  name: 'help',
  description: 'Shows all available commands.',
  async execute(message, args) {
    try {
      await message.reply(`
**Available Commands:**  
- Prefix: \`*\` - (All commands start with this)
- Optional values: \`[...]\`

**Drivers And Teams Points:**  
- \`*points [driver/team]\` - Displays your current points, or the selected driver/team.  
- \`*standings [driver/team | 'drivers' or 'constructors']\` - Displays overall drivers/constructors standings, or the selected driver's and team's points.  

**General:**  
- \`*help\` - Show this help message.
- \`*github\` - Link to the GitHub.
      `);
    } catch (error) {
      console.error('Error in help command:', error);
      message.reply('There was an error displaying the help menu.');
    }
  }
};
