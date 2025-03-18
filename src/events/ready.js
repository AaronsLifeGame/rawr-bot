const { Client } = require('discord.js');

module.exports = async (client) => {
  // Set the bots username (global)
  try {
    await client.user.setUsername('rawr_bot');
    console.log('Username changed successfully!');
  } catch (error) {
    console.error('Error changing username:', error);
  }

  // Set the botss display name in every guild
  const displayName = 'RAWR Bot';
  client.guilds.cache.forEach(async (guild) => {
    try {
      const member = await guild.members.fetch(client.user.id);
      await member.setNickname(displayName);
      // console.log(`Display name changed to "${displayName}" in guild: ${guild.name}`);
    } catch (error) {
      console.error(`Error changing display name in guild ${guild.name}:`, error);
    }
  });

  console.log('Bot is online and ready!');
};
