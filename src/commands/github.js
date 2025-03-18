module.exports = {
  name: 'github',
  description: 'Link to the GitHub.',
  async execute(message, args) {
    try {
      await message.reply(`https://github.com/AaronsLifeGame/rawr-bot`);
    } catch (error) {}
  }
};
