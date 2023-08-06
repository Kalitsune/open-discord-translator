const { REST, Routes } = require('discord.js');

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

module.exports = {
    async deployAll() {

    },

    async deployCommands(clientId, commands) {
        try {
            // If a guild id is provided, only register commands to that guild
            if (process.env.GUILD) {
                console.log(`Started refreshing ${commands.length} Guild (/) commands.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(clientId, process.env.GUILD),
                    { body: commands },
                );

                console.log(`Successfully reloaded ${data.length} Guild (/) commands.`);
            } else { // Otherwise, register commands globally
                console.log(`Started refreshing ${commands.length} application (/) commands.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationCommands(clientId),
                    { body: commands },
                );

                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            }
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    }
}