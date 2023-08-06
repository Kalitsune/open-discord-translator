//ClientReady event
const { deployCommands } = require('../interactions/deploy.js');

module.exports = {
    async handler(client) {
        // check registered commands
        await client.application.commands.fetch();

        console.log(`Ready! Serving ${client.application.commands.cache.size} commands as ${client.user.tag}`);

        //check if registered commands match the ones in the commands folder
        const registeredCommands = client.application.commands.cache.map(command => command.name);
        const commands = client.commands.map(c => c.data.toJSON().name);

        if (registeredCommands.length !== commands.length) {
            console.log(`[WARNING] The number of registered commands (${registeredCommands.length}) does not match the number of commands in the commands folder (${commands.length}). Updating registered commands...`);
            await deployCommands(client.application.id, client.commands.map(c => c.data.toJSON()));
        }
    }
}