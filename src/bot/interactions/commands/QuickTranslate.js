const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder} = require('discord.js');

const { getKeyLocalizations, getLocalization} = require('../../../localizations/localizations');
const { getFlagEmoji } = require('../../../utils');

module.exports = {
    init (client) {

    },
    data: new ContextMenuCommandBuilder()
        .setName('QuickTranslate')
        .setNameLocalizations(getKeyLocalizations('context:translate.name'))
        .setType(ApplicationCommandType.Message),

    async execute(interaction) {
        if (!interaction.targetMessage.content) {
            await interaction.reply({ content: getLocalization("context:translate.noText", interaction.locale), ephemeral: true});
            // wait 5 seconds and delete the message
            return setTimeout(() => {
                return interaction.deleteReply();
            }, 5000);
        }

        const translated = await interaction.client.translate(interaction.targetMessage.content, interaction.locale);

        //make the embed
        const data = {
            from: getFlagEmoji(translated.from),
            to: getFlagEmoji(interaction.locale)
        }
        const responseEmbed = new EmbedBuilder().setColor(process.env.ACCENT_COLOR)
            .addFields({ name: getLocalization("commands:translate.success", interaction.locale ,data), value: translated.text})
            .setFooter({text: getLocalization("context:translate.footer", interaction.locale)
    });
        await interaction.reply({ embeds: [responseEmbed], ephemeral: true});

    }
}