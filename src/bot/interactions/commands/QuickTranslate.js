const { ContextMenuCommandBuilder, ApplicationCommandType} = require('discord.js');

const { getKeyLocalizations, getLocalization} = require('../../../localizations/localizations');
const { makeResponseEmbeds } = require('../../../helpers/makeResponseEmbeds');

module.exports = {
    init (client) {

    },
    data: new ContextMenuCommandBuilder()
        .setName('QuickTranslate')
        .setNameLocalizations(getKeyLocalizations('context:translate.name'))
        .setType(ApplicationCommandType.Message),

    async execute(interaction) {
        if (!interaction.targetMessage.content) {
            await interaction.reply({ content: getLocalization("common:errors.noText", interaction.locale), ephemeral: true});
            // wait 5 seconds and delete the message
            return setTimeout(() => {
                return interaction.deleteReply();
            }, 5000);
        }

        const translated = await interaction.client.translate(interaction.targetMessage.content, interaction.locale);

        await interaction.reply({ embeds: makeResponseEmbeds(interaction.locale, translated.from, interaction.locale, translated.text), ephemeral: true});

    }
}
