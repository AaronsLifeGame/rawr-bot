module.exports = async (message, config) => {
  // Ensure the message starts with the prefix and isn't from a bot
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  // Split the message into arguments, with the first being the command
  const args = message.content.slice(config.prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  // Log the command for debugging
  console.log(`Received command: ${command}`);

  // Check if the command exists and execute it
  if (message.client.commands.has(command)) {
    try {
      await message.client.commands.get(command).execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to execute that command!');
    }
  }
};
