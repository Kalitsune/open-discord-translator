//ClientReady event
const { Events, ActivityType } = require('discord.js');
const { deployCommands } = require('../interactions/deploy.js');
const translation_driver = require('../../translations/translations.js')

let verbose = false;
module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        client.user.setActivity(`Translating with ${translation_driver.name}.`, {type: ActivityType.Custom});    

        // if process.env.GUILD is set, check if the bot is in the guild
        if (process.env.GUILD) {
            if (!client.guilds.cache.has(process.env.GUILD)) {
                console.log(`[FATAL] the bot is not in the guild (${process.env.GUILD}), cannot register commands.`);
                process.exit(1);
            }
        }

        await reloadSlashCommands(client)

        // Greet the user
        console.log(`Ready! Serving ${client.commands.size} commands as ${client.user.tag}`);

        console.log(`Invite me using: https://discord.com/api/oauth2/authorize?client_id=${client.application.id}&permissions=2684371968&scope=bot`)

        client.user.setActivity(`Translating with ${translation_driver.name}.`, {type: ActivityType.Custom});
    }
}

async function reloadSlashCommands(client) {
    const globalCommandsCache = client.application.commands.cache;
    const globalCommands = globalCommandsCache.map(command => command.name);

    // delete global commands if the guild is set
    if (process.env.GUILD && globalCommands.length > 0) {
        console.log(`[WARNING] deleting global commands since the guild is set.`);
        await deployCommands(client.application.id, [], "");
    }

    //if the guild is unset, check if there's any guild with commands registered
    if (!process.env.GUILD) {
        client.guilds.cache.forEach(guild => {
            // fetch guild commands and resolve the promise continues without blocking the script even tho the log apparition order may be wrong
            guild.commands.fetch().then(guildCommandsCache => {
                // check if the guild has commands registered
                if (guildCommandsCache.size > 0) {
                    console.log(`[WARNING] guild (${guild.id}) has commands registered.`);
                    deployCommands(client.application.id, [], guild.id);
                }
            });
        });
    }
    
    // reload the commands
    if (process.env.SKIP_COMMAND_VALIDATION) {
        console.log(`[INFO] commands validity check skipped.`);
    } else {
        //check commands validity
        console.log(`[INFO] reloading commands...`);
        await deployCommands(client.application.id, client.commands.map(c => c.data.toJSON()));
        console.log(`[INFO] done!`)
    }
}
