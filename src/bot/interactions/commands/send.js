const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, DiscordjsErrorCodes} = require('discord.js');
const { ChannelType} = require('discord-api-types/v10');

const { getKeyLocalizations } = require('../../../localizations/localizations.js');
const {getLocalization} = require("../../../localizations/localizations");

module.exports = {
    init (client) {
        //get the country codes
        let languages = client.languages.map((lang) => {return {name: lang.language, value: lang.code}});
        // edit the command
        const command = client.commands.get('send');
        // transform the sources/targets into choices {name, value}
        languages.forEach(choice => command.data.options[1].addChoices(choice));
        languages.forEach(choice => command.data.options[2].addChoices(choice));
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
        const from = interaction.options.getString('from') || 'auto';

        const translated = await interaction.client.translate(text, to, from);

        // if possible use webhooks, otherwise use the bot
        // if the channel is a thread the webhook needs to be created in the parent channel
        const isThread = interaction.channel.type === ChannelType.PublicThread || interaction.channel.type === ChannelType.PrivateThread;
        const webhookChannel = isThread ? interaction.channel.parent : interaction.channel;
        let webhook;
        try {
            // send a message using the user name and pfp using webhooks
            //check if there's a webhook that can be used
            webhook = await webhookChannel.fetchWebhooks().then(webhooks => {
                return webhooks.find(webhook => webhook.owner.id === interaction.client.user.id);
            });

            if (!webhook) {
                //create a webhook
                webhook = await webhookChannel.createWebhook({
                    name: interaction.client.user.username,
                    avatar: interaction.client.user.displayAvatarURL({format: 'png', dynamic: true}),
                    reason: "needed for /send to use webhooks instead of the bot"
                });
            }

        } catch (e) {
            // fallback method
            return interaction.reply(translated.text)
        }

        // send the message
        const message = await webhook.send({
            content: translated.text,
            username: interaction.user.username,
            avatarURL: interaction.user.displayAvatarURL({format: 'png', dynamic: true}),
            threadId: isThread ? interaction.channel.id : null
        });
        // reply with an ephemeral delete button
        const responseEmbed = new EmbedBuilder()
            .setTitle(getLocalization('commands:send.success.title', interaction.locale))
            .setDescription(getLocalization('commands:send.success.description', interaction.locale, {url: message.url}))
            .setFooter(process.env.DELETE_BUTTON_TIMEOUT ? {text: getLocalization('commands:send.success.footer', interaction.locale, {time: process.env.DELETE_BUTTON_TIMEOUT})} : null)
            .setColor(process.env.ACCENT_COLOR);
        const deleteButton = new ButtonBuilder()
            .setCustomId(`delete-${message.id}`)
            .setLabel(getLocalization('commands:send.success.delete', interaction.locale))
            .setEmoji('🗑️')
            .setStyle(ButtonStyle.Danger)
        const response = await interaction.reply({embeds: [responseEmbed],components: [{type:1, components:[deleteButton]}], ephemeral: true});
        // wait for the button to be pressed
        const collectorFilter = i => i.component.data.custom_id === `delete-${message.id}`;
        try {
            // wait for the button to be pressed
            await response.awaitMessageComponent({ filter: collectorFilter, time: process.env.DELETE_BUTTON_TIMEOUT*1000 });
            //delete the webhook message
            await message.delete();
        } catch (e) {
            if (e instanceof DiscordjsErrorCodes.InteractionCollectorError) {
                console.log(e);
            }
        }
        //remove the delete message
        return await interaction.deleteReply();
    }
};
