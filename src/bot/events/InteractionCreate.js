//InteractionCreate event
const { Events, EmbedBuilder } = require('discord.js');
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
                //create the error message
                const responseEmbed = new EmbedBuilder()
                    .setColor(process.env.ACCENT_COLOR)
                    .setDescription(getLocalization("common:errors.missingPermission", interaction.locale));

                //send the error message
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ embeds: [responseEmbed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
                }
            }

            //create the error message
            const responseEmbed = new EmbedBuilder()
                .setColor(process.env.ACCENT_COLOR)
                .setDescription(getLocalization("common:errors.unknown", interaction.locale));

            //send the error message
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [responseEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
            }
            console.error(error);
        }
    }
}