require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { GoogleSpreadsheet } = require('googleapis');
const config = require('./config.json');

// Initialize the Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Set the config on the client object
client.config = config;

// Import events
const messageEvent = require('./events/message');
const errorEvent = require('./events/error');
const readyEvent = require('./events/ready');

// Event listeners for the bot
client.on('messageCreate', (message) => messageEvent(message, client.config));
client.on('error', errorEvent);
client.on('ready', readyEvent);

// Simple command map (replaced with slash commands later)
client.commands = new Map();
client.commands.set('points', require('./commands/points'));
client.commands.set('standings', require('./commands/standings'));
client.commands.set('help', require('./commands/help'));
client.commands.set('github', require('./commands/github'));

// Log in to Discord
client.login(process.env.TOKEN);

module.exports = client;
