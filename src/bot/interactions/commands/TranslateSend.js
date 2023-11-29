const { ContextMenuCommandBuilder, ApplicationCommandType} = require('discord.js');
const { PermissionFlagsBits } = require("discord-api-types/v10")
const { makeResponseEmbeds } = require('../../../helpers/makeResponseEmbeds');
const { sendMessageAsUser } = require('../../../helpers/sendMessageAsUser');

const { getKeyLocalizations, getLocalization} = require('../../../localizations/localizations');

module.exports = {
    init (client) {

    }, 
    data: new ContextMenuCommandBuilder()
        .setName('TranslateSend')
        .setNameLocalizations(getKeyLocalizations('context:send.name'))
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        if (!interaction.targetMessage.content) {
            await interaction.reply({ content: getLocalization("common:errors.noText", interaction.locale), ephemeral: true});
            // wait 5 seconds and delete the message
            return setTimeout(() => {
                return interaction.deleteReply();
            }, 5000);
        }

        const translated = await interaction.client.translate(interaction.targetMessage.content, interaction.guildLocale);
        
        // send the translated message
        sendMessageAsUser(interaction, translated);


        // cancel the interaction response if not already responded
        if (!interaction.replied) {
            await interaction.reply({content: '​', ephemeral: true});
            setTimeout(() => interaction.deleteReply(), 100);
        }
    }
}
