// imports
const fs = require('fs')
const path = require('path');
require('dotenv').config({path: fs.existsSync('.env.dev') ? '.env.dev' : '.env'}); // init dotenv to use .env.dev instead of .env if it exists

const { Client, Collection, GatewayIntentBits} = require('discord.js');

const api = require('./translations/translations.js');

async function main() {
  // init discord.js
  const client = new Client({intents: [
      GatewayIntentBits.Guilds
  ]});
  console.log(`[STARTUP] Starting bot...`)

  // init the translation API
  console.log(`[STARTUP] initialising ${process.env.TRANSLATION_API_DRIVER} translation driver...`);
  // init the translation API and filter the languages to be the
  const languages = await api.init();
  // limit the selected languages to the ones in the .env file
  if (process.env.SELECTED_LANGUAGES) {
    // the .env format is csv so make it an array
    const selectedLanguages = process.env.SELECTED_LANGUAGES.split(',');

    // to keep the SELECTED_LANGUAGES order we need to first parse the languages to easily find them
    const parsedLanguages = {};
    languages.forEach(lang => parsedLanguages[lang.code] = lang);

    // then we can filter the languages to keep only the ones in the .env file
    client.languages = selectedLanguages.map(lang => parsedLanguages[lang]);
  } else {
    // if no languages are specified in the .env file use all the languages (note: they will be capped at 25)
    client.languages = languages;
  }
  // limit the number of languages to 25
  if (client.languages.length > 25) client.languages.length = 25;
  // filter undefined lanugages
  client.languages = client.languages.filter(lang => lang !== undefined);
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
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('name' in event && 'execute' in event) {
      client.on(event.name, event.execute)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
  console.info(`[STARTUP] ${eventFiles.length} events found.`);

  // run bot
  await client.login(process.env.TOKEN);
}

main();