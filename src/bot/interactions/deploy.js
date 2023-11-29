const { REST, Routes } = require('discord.js');

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

module.exports = {
    async deployCommands(clientId, commands, guildId=process.env.GUILD) {
        console.log(`[WARNING] commands are not valid, re-deploying...`);
        // deploy new commands
        try {
            // If a guild id is provided, only register commands to that guild
            if (guildId) {
                if (commands.length) console.log(`Started refreshing ${commands.length} Guild (/) commands.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands },
                );

                if (data.length) console.log(`Successfully reloaded ${data.length} Guild (/) commands.`);
            } else { // Otherwise, register commands globally
                if (commands.length) console.log(`Started refreshing ${commands.length} application (/) commands.`);
                console.log(`[NOTE] global commands updates are not instantaneous.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationCommands(clientId),
                    { body: commands },
                );

                if (data.length) {
                    console.log(`Successfully refreshed ${data.length} application (/) commands.`);
                    console.log("[EXIT] Restart needed. Byebye.")
                    process.exit(0);
                }          
            }
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    },
}
