const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, DiscordjsErrorCodes} = require('discord.js');

const { getKeyLocalizations, getLocalization } = require('../../../localizations/localizations.js');
const { sendMessageAsUser } = require('../../../helpers/sendMessageAsUser.js');

module.exports = {
    init (client) {
        //get the country codes
        let languages = client.languages.map((lang) => {return {name: lang.name, value: lang.code}});
        // edit the command
        const command = client.commands.get('send');
        // transform the sources/targets into choices {name, value}
        command.data.options[1].choices = languages
        command.data.options[2].choices = languages
    },
    data: new SlashCommandBuilder()
        .setName('send').setDescription("Directly send text in another language under your name.")
        .setNameLocalizations(getKeyLocalizations('commands:send.name'))
        .setDescriptionLocalizations(getKeyLocalizations('commands:send.description'))
        .addStringOption(option =>
            option.setName('text').setDescription("The text to translate.")
                .setNameLocalizations(getKeyLocalizations('common:options.text.name'))
                .setDescriptionLocalizations(getKeyLocalizations('common:options.text.description'))
                .setRequired(true))
        .addStringOption(option =>
            option.setName('to').setDescription("The language to translate to.")
                .setNameLocalizations(getKeyLocalizations('common:options.to.name'))
                .setDescriptionLocalizations(getKeyLocalizations('common:options.to.description'))
                .setRequired(true))
        .addStringOption(option =>
            option.setName('from').setDescription("The language to translate from.")
                .setNameLocalizations(getKeyLocalizations('common:options.from.name'))
                .setDescriptionLocalizations(getKeyLocalizations('common:options.from.description'))
                .setRequired(false)),
    async execute(interaction) {
        //    translate
        const text = interaction.options.getString('text');
        const to = interaction.options.getString('to');
        //    ,
        const from = interaction.options.getString('from');

        const translated = await interaction.client.translate(text, to, from);

        const {webhook, sentMessages} = await sendMessageAsUser(interaction, translated);

        // If sentMessages is empty, this means that the messages were sent via text and not webhook so we can end the function there.
        if (sentMessages.length == 0) {
          return;
        }

        // reply with an ephemeral delete button
        const responseEmbed = new EmbedBuilder()
            .setTitle(getLocalization('commands:send.success.title', interaction.locale))
            .setDescription(getLocalization('commands:send.success.description', interaction.locale, {url: sentMessages[0].url}))
            .setFooter(process.env.DELETE_BUTTON_TIMEOUT ? {text: getLocalization('commands:send.success.footer', interaction.locale, {time: process.env.DELETE_BUTTON_TIMEOUT})} : null)
            .setColor(process.env.ACCENT_COLOR);
        const deleteButton = new ButtonBuilder()
            .setCustomId(`delete-${sentMessages[0].id}`)
            .setLabel(getLocalization('commands:send.success.delete', interaction.locale))
            .setEmoji('🗑️')
            .setStyle(ButtonStyle.Danger)
        const response = await interaction.reply({embeds: [responseEmbed],components: [{type:1, components:[deleteButton]}], ephemeral: true});
        // wait for the button to be pressed
        const collectorFilter = i => i.component.data.custom_id === `delete-${sentMessages[0].id}`;
        try {
            // wait for the button to be pressed
            await response.awaitMessageComponent({ filter: collectorFilter, time: process.env.DELETE_BUTTON_TIMEOUT*1000 });
            //delete the webhook message
            for (let i = 0; i < sentMessages.length; i++) {
                webhook.deleteMessage(sentMessages[i].id);
            }
        } catch (e) {
            if (e.code !== DiscordjsErrorCodes.InteractionCollectorError) {
                throw e;
            }
        }
        //remove the delete message
        return await interaction.deleteReply();
    }
};
