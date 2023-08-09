// imports
const fs = require('fs')
const path = require('path');
require('dotenv').config({path: fs.existsSync('.env.dev') ? '.env.dev' : '.env'}); // init dotenv to use .env.dev instead of .env if it exists

const { Client, Events, Collection } = require('discord.js');

const api = require('./translations/translations.js');

async function main() {
  // init discord.js
  const client = new Client({intents: []});
  console.log(`[STARTUP] Starting bot...`)

  // init the translation API
  console.log(`[STARTUP] initialising ${process.env.TRANSLATION_API_DRIVER} translation driver...`);
  client.languages = await api.init();
  client.translate = api.translate;

  // init commands
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, 'bot', 'interactions','commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      if ('init' in command) command.init(client);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
  console.info(`[STARTUP] ${client.commands.size} commands found.`);


  //init events
  client.events = new Collection();

  const eventsPath = path.join(__dirname, 'bot', 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if ('handler' in event) {
      client.events.set(file.slice(0,-3), event);
      client.on(Events[file.slice(0,-3)], event.handler);
    } else {
      console.log(`[WARNING] The event at ${filePath} is missing an handler.`);
    }
  }
  console.info(`[STARTUP] ${client.events.size} events found.`);
  // run bot
  await client.login(process.env.TOKEN);
}

main();