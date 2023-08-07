# open discord translator
 An open source discord bot using the latest discord integration features and supporting multiple translation backend

## Features
### Translation Command

### Directly send the translated message

### Context menu translation

## Installation
### Using Docker

### Using nodejs
clone the repository and install the dependencies
```bash
git clone https://github.com/Kalitsune/open-discord-translator
cd open-discord-translator
npm install --production
```

edit the .env file to your needs, be sure to set the `DISCORD_TOKEN` variable
check the [Environment variables](#environment-variables) section for more information

then start the bot
```bash
npm start
```

### Environment variables
| Variable                  | Description                                                                                                                                                                            | Default value |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `TOKEN`                   | The discord bot token                                                                                                                                                                  | `none`        |
| `GUILD`                   | The guild ID where the bot will be restricted to                                                                                                                                       | `none`        |
| `SKIP_COMMAND_VALIDATION` | If set to true, the bot will not check if the commands are up to date                                                                                                                  | `false`       |
| `TRANSLATION_API_DRIVER`  | The translation API to use ([check supported drivers](#translation-api-drivers))                                                                                                       | `google`      |
| `GOOGLE_API_KEY`          | Your [google api key](https://ezgielouzeh.medium.com/google-translate-api-javascript-81f55039611d), only needed if you use the [google paid translation API](#translation-api-drivers) | `none`        |
| `DEEPL_AUTH_KEY`          | Your deepl auth key, only needed if you use the [deepl translation API](#translation-api-drivers)                                                                                      | `none`        |
| `DATABASE_DRIVER`         | The database driver to use ([check supported drivers](#database-api-drivers))                                                                                                          | `sqlite`      |
### Translation API drivers
| Driver name   | Description                                                                           |
|---------------|---------------------------------------------------------------------------------------|
| `google`      | The google translation API for free, the threshold might be low                       |
| `paid_google` | The google translation API, you need to set the `GOOGLE_API_KEY` environment variable |
| `deepl`       | The deepl translation API, you need to set the `DEEPL_AUTH_KEY` environment variable  |
### Database API drivers
| Driver name | Description                                                                        |
|-------------|------------------------------------------------------------------------------------|
| `sqlite`    | The sqlite database driver, you need to set the `SQLITE_PATH` environment variable |

## Development 
### Setup
clone the repository and install the dependencies
```bash
git clone https://github.com/Kalitsune/open-discord-translator
cd open-discord-translator
npm install
```

create a .env.dev file and set the `DISCORD_TOKEN` variable (check the [Environment variables](#environment-variables) section for more information)
```bash
cp .env .env.dev
```

then start the bot
```bash
npm run dev
```

### Discord api
the bot is initialized in the `./src/index.js` file,
everything in the `./src/discord/` directory is related to the discord api
the `./discord/events/` discord directory contains the discord events listeners, the file name must be [one of those](https://old.discordjs.dev/#/docs/discord.js/main/typedef/Events)
the `./discord/interactions/commands/` discord directory contains the discord commands, the file name does not matter

### Add a new translation API driver
create a new file in the `./src/api/drivers/` directory
```bash
touch ./src/api/drivers/mydriver.js
```

make sure to export the following functions
```js
module.exports = {
    async init() {
        // if you need to initialize the driver, do it here
        // you must return the supported source and target languages 
        // (be sure to add 'auto' if your driver supports automatic source language detection)
        const supported_languages = [
            {
                "language": "Afrikaans",
                "code": "af"
            },
            // ...
        ];
        const source = supported_languages.push({ "language": "Automatic", "code": "auto" });
        const target = supported_languages;
        return { source, target }
        return { source, target }
    },
    async translate(text, to, from= "auto") {
        // translate the text from the source language to the target language
        // return the translated text
        // feel free to add more environment variables if needed (don't forget to update the readme)
        
        // you must return the translated text and the source language, if it is auto, then return the detected language
        return {translated_text, source_language}
    }
}
```

then you set the `TRANSLATION_API_DRIVER` environment variable to your driver name and start the bot

### Add a new database driver
create a new file in the `./src/database/drivers/` directory
```bash
touch ./src/database/drivers/mydriver.js
```

make sure to export the following functions
```js
module.exports = {
    async init() {
        // if you need to initialize the driver, do it here
        // feel free to add more environment variables if needed (don't forget to update the readme)
    },
    async getLanguage(userId) {
        // get the language code associated with the user id
        // return the value
    },
    async setLanguage(userId, languageCode) {
        // set the language code for this user id
    },
    async addReplicaChannels(sourceChannelId, targetChannelId, targetLanguageCode) {
        // add a channel to be replicated in another languages
    },
    async getReplicaChannels() {
        // get all the channels to be replicated
    },
    async removeReplicaChannels(sourceChannelId, targetChannelId) {
        // remove a channel from the replication list
    },
}
```

then you set the `DATABASE_DRIVER` environment variable to your driver name and start the bot