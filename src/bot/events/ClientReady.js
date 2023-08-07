//ClientReady event
const { deployCommands } = require('../interactions/deploy.js');

module.exports = {
    async handler(client) {
        // check registered commands
        console.log(`Ready! Serving ${client.commands.size} commands as ${client.user.tag}`);

        await checkCommandValidity(client);

        console.log(`[INFO] commands parity check is over.`);
    }
}

async function fetchVars(client) {
    await client.application.commands.fetch();
    if (process.env.GUILD) await client.guilds.cache.get(process.env.GUILD).commands.fetch();

    // const def
    // globalCommandsCache the commands registered globally
    // globalCommands the names of the commands registered globally
    // guildCommandsCache the commands registered in the guild
    // guildCommands the names of the commands registered in the guild
    // registeredCommands the names of the commands registered in the guild if the guild is set, otherwise the names of the commands registered globally
    // commands the names of the commands in the commands folder
    const globalCommandsCache = client.application.commands.cache;
    const globalCommands = globalCommandsCache.map(command => command.name);
    const guildCommandsCache = process.env.GUILD ? client.guilds.cache.get(process.env.GUILD).commands.cache : [];
    const guildCommands = guildCommandsCache.map(command => command.name);
    const registeredCommands = process.env.GUILD ? guildCommands : globalCommands;
    const registeredCommandsCache = process.env.GUILD ? guildCommandsCache : globalCommandsCache;
    const commands = client.commands.map(c => c.data.toJSON().name);

    return {globalCommandsCache, globalCommands, guildCommandsCache, guildCommands, registeredCommands, registeredCommandsCache, commands};
}

function checkJSONEquality(command1, command2) {
    for (const key in command1) {
        // array check
        if ((Array.isArray(command1[key]))) {
            for (let i = 0 ; i < command1[key].length; i += 1) {
                //check if the array is the same length
                if (command1[key].length !== command2[key].length) {
                    console.log(`[WARNING] 0commands parity check failed: found ${command2['name']}/${[key]}:ARRAY instead of ${command1['name']}/${[key]}:ARRAY.`);
                    return false;
                }

                //check if the array content is the same
                if (!checkJSONEquality(command1[key][i], command2[key][i])) {
                    return false;
                }
            }
        // object check
        } else if (typeof command1[key] === 'object' && command1[key] !== null && !checkJSONEquality(command1[key], command2[key])) {
            console.log(`[WARNING] 1commands parity check failed: found ${command2['name']}/${[key]}:OBJECT instead of ${command1['name']}/${[key]}:OBJECT.`);
            return false;
        // other check
        } else if ((typeof command1[key] === 'string' ? (command1[key].trim()) : (command1[key] || false)) !== (command2[key] || false)) {
            console.log(`[WARNING] 2commands parity check failed: found ${command1['name']}/${[key]}:"${command1[key]}" instead of ${command2['name']}/${[key]}:"${command2[key]}".`);
            return false;
        }
    }

    return true;
}

async function checkCommandValidity(client) {
    let {globalCommandsCache, globalCommands, guildCommandsCache, guildCommands, registeredCommands, registeredCommandsCache, commands} = await fetchVars(client);

    // delete global commands if the guild is set
    if (process.env.GUILD && globalCommands.length > 0) {
        console.log(`[WARNING] deleting global commands since the guild is set.`);
        await deployCommands(client.application.id, [], "");
    }

    //check that the commands are the same
    if (commands.length !== registeredCommands.length) {
        console.log(`[WARNING] commands parity check failed: found ${registeredCommands.length} commands instead of ${commands.length}.`);
        await deployCommands(client.application.id, client.commands.map(c => c.data.toJSON()));
        return false;
    }

    //check if every command in the commands folder match the registered commands
    for (let command of commands) {
        command = client.commands.get(command).data.toJSON();
        const registeredCommand = registeredCommandsCache.find(c => c.name === command.name);
        if (!checkJSONEquality(command, registeredCommand)) {
            await deployCommands(client.application.id, client.commands.map(c => c.data.toJSON()));
            return false;
        }
    }
}