module.exports = {
  name: 'help',
  description: 'Shows all available commands.',
  async execute(message, args) {
    try {
      await message.reply(`
**Available Commands:**  
- Prefix: \`*\` - (All commands start with this)

**Drivers And Teams Points:**  
- \`*points [gamertag/username/team]\` - Displays your current points, or the selected driver/team.  
- \`*standings [gamertag/username]\` - Displays overall driver standings, or the selected driver.  
- \`*constructors [gamertag/username/team]\` - Displays overall team standings, or the selected team.  

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
