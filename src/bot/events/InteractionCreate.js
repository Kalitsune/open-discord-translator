//InteractionCreate event
const { Events } = require('discord.js');
const { getLocalization } = require('../../localizations/localizations.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }

                await command.execute(interaction);
            }
        } catch (error) {
            if (error.code === 50013) {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: getLocalization("common:errors.missingPermission", interaction.locale), ephemeral: true });
                } else {
                    await interaction.reply({ content: getLocalization("common:errors.missingPermission", interaction.locale), ephemeral: true });
                }
            }

            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}