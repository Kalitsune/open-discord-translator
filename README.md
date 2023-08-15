# open discord translator
 An open source discord bot using the latest discord integration features and supporting multiple translation backend

## Features
### Translation Command

### Directly send the translated message

### Context menu translation

## Installation
### Using Docker (recommended)
#### Docker compose (recommended)
Create a `docker-compose.yml` file and set the environment variables (check the [Environment variables](#environment-variables) section for more information)
```yaml
version: "3.7"
services:
  open-discord-translator:
    container_name: open-discord-translator
    image: ghcr.io/kalitsune/open-discord-translator:latest
    restart: always
    environment:
      - TOKEN=[your token here] # https://discord.com/developers/applications
      - GUILD= # if set, the commands will only be available in this guild whose ID is linked here
      - SKIP_COMMAND_VALIDATION=false # if set to true, the bot will not check if the commands are up to date
      - ACCENT_COLOR=Blurple # the color of the embeds
      - DELETE_BUTTON_TIMEOUT=10 # the time in s before the delete button disappears (leave empty for infinite)
      - TRANSLATION_API_DRIVER=google # paid_google.js or deepl
      - SELECTED_LANGUAGES=en,es,fr,de,it,ja,ko,pt,ru,zh-CN,zh-TW,pl,nl,sv,ar,cs,da,fi,el,hi,hu,id,no,la,ro # the languages you want to translate to and from (comma separated)
      - GOOGLE_API_KEY= # your google API key (paid google driver)
      - DEEPL_API_KEY= # your deepl auth key (deepl driver)
      - DATABASE_PATH=database.sqlite # the path to the database file
      - DATABASE_DRIVER=sqlite # sqlite is the only driver supported for now but feel free to add more
    volumes:
      - open-discord-translator:/app/database.sqlite
volumes:
  open-discord-translator:
```
then start the bot
```bash
docker-compose up -d
```
to invite the bot, use the link printed in the console

#### Docker cli
```bash
docker volume create open-discord-translator
docker run -d \
    --name open-discord-translator \
    -e TOKEN=[your token here] \
    -e GUILD= \
    -e SKIP_COMMAND_VALIDATION=false \
    -e ACCENT_COLOR=Blurple \
    -e DELETE_BUTTON_TIMEOUT=10 \
    -e TRANSLATION_API_DRIVER=google \
    -e SELECTED_LANGUAGES=en,es,fr,de,it,ja,ko,pt,ru,zh-CN,zh-TW,pl,nl,sv,ar,cs,da,fi,el,hi,hu,id,no,la,ro \
    -e GOOGLE_API_KEY= \
    -e DEEPL_API_KEY= \
    -e DATABASE_PATH=database.sqlite \
    -e DATABASE_DRIVER=sqlite \
    -v open-discord-translator:/app/database.sqlite \
    ghcr.io/kalitsune/open-discord-translator:latest
```
to invite the bot, use the link printed in the console

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
to invite the bot, use the link printed in the console

### Environment variables
| Variable                  | Description                                                                                                                                                                            | Default value       |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|
| `TOKEN`                   | The discord bot token                                                                                                                                                                  | `none`              |
| `GUILD`                   | The guild ID where the bot will be restricted to                                                                                                                                       | `none`              |
| `SKIP_COMMAND_VALIDATION` | If set to true, the bot will not check if the commands are up to date                                                                                                                  | `false`             |
| `ACCENT_COLOR`            | Color used for the bot embeds can be a number, hex or [one of those](https://old.discordjs.dev/#/docs/discord.js/14.11.0/typedef/ColorResolvable)                                      | `Blurple`           |
| `DELETE_BUTTON_TIMEOUT`   | The time in seconds before the delete button for the `send` disappear (leave empty for infinite)                                                                                       | `10`                |  
| `TRANSLATION_API_DRIVER`  | The translation API to use ([check supported drivers](#translation-api-drivers))                                                                                                       | `google`            |
| `SELECTED_LANGUAGES`      | The languages to use for the translation command, if empty, the first 25 supported languages returned by the translation driver will be used                                           | `[CSV, check .env]` |
| `GOOGLE_API_KEY`          | Your [google api key](https://ezgielouzeh.medium.com/google-translate-api-javascript-81f55039611d), only needed if you use the [google paid translation API](#translation-api-drivers) | `none`              |
| `DEEPL_API_KEY`           | Your deepl auth key, only needed if you use the [deepl translation API](#translation-api-drivers)                                                                                      | `none`              |
| `DATABASE_DRIVER`         | The database driver to use ([check supported drivers](#database-api-drivers))                                                                                                          | `sqlite`            |
| `SQLITE_PATH`             | The path to the sqlite database file, only needed if you use the [sqlite database driver](#database-api-drivers)                                                                       | `./database.sqlite` |

### Translation API drivers
| Driver name   | Description                                                                           |
|---------------|---------------------------------------------------------------------------------------|
| `google`      | The google translation API for free, the threshold might be low                       |
| `paid_google` | The google translation API, you need to set the `GOOGLE_API_KEY` environment variable |
| `deepl`       | The deepl translation API, you need to set the `DEEPL_API_KEY` environment variable   |
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
to invite the bot, use the link printed in the console

### Discord api
the bot is initialized in the `./src/index.js` file,
everything in the `./src/discord/` directory is related to the discord api
the `./discord/events/` discord directory contains the discord events listeners, the file name must be [one of those](https://old.discordjs.dev/#/docs/discord.js/main/typedef/Events)
the `./discord/interactions/commands/` discord directory contains the discord commands, the file name does not matter

### Add a new translation API driver
create a new file in the `./src/api/drivers/` directory
```bash
touch ./src/translations/drivers/mydriver.js
```

make sure to export the following functions
```js
module.exports = {
    async init() {
        // if you need to initialize the driver, do it here
        // you must return the supported source and target languages 
        // warning: the supported languages can't be more than 25 due to discord limitations
        const supported_languages = [
            {
                "language": "Afrikaans",
                "code": "af"
            },
            // ...
        ];
        return supported_languages
    },
    async translate(text, to, from= undefined) {
        // translate the text from the source language to the target language
        // return the translated text
        // feel free to add more environment variables if needed (don't forget to update the readme)
        
        // you must return the translated text and the source language, if it is auto, then return the detected language
        return {text: translated_text, from: source_language}
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
    async addReplicaChannels(guildId, sourceChannelId, targetChannelId, targetLanguageCode) {
        // add a channel to be replicated in another languages
    },
    async getReplicaChannels(guildID) {
        // get all the channels to be replicated
    },
    async removeReplicaChannel(sourceChannelId, targetChannelId) {
        // remove a channel from the replication list
    },
}
```

then you set the `DATABASE_DRIVER` environment variable to your driver name and start the bot