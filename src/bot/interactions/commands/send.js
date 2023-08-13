const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const { ChannelType} = require('discord-api-types/v10');

const { getKeyLocalizations } = require('../../../localizations/localizations.js');
const {getLocalization} = require("../../../localizations/localizations");

module.exports = {
    init (client) {
        //get the country codes
        let sources = client.languages.sources;
        if (sources.length > 25) sources.length = 25;

        let targets = client.languages.targets;
        if (targets.length > 25) targets.length = 25;

        // edit the command
        const command = client.commands.get('send');
        // transform the sources/targets into choices {name, value}
        targets.map((lang) => {return {name: lang.language, value: lang.code}}).forEach(choice => command.data.options[1].addChoices(choice));
        sources.map((lang) => {return {name: lang.language, value: lang.code}}).forEach(choice => command.data.options[2].addChoices(choice));
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
        try {
            // send a message using the user name and pfp using webhooks

            // if the channel is a thread the webhook needs to be created in the parent channel
            const isThread = interaction.channel.type === ChannelType.PublicThread || interaction.channel.type === ChannelType.PrivateThread;
            const webhookChannel = isThread ? interaction.channel.parent : interaction.channel;

            //check if there's a webhook that can be used
            let webhook = await webhookChannel.fetchWebhooks().then(webhooks => {
                return webhooks.find(webhook => webhook.owner.id === interaction.client.user.id);
            });

            if (!webhook) {
                console.log("creating a webhook");
                //create a webhook
                webhook = await webhookChannel.createWebhook({
                    name: interaction.client.user.username,
                    avatar: interaction.client.user.displayAvatarURL({format: 'png', dynamic: true}),
                    reason: "needed for /send to use webhooks instead of the bot"
                });
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
                .setFooter(process.env.DELETE_BUTTON_TIMEOUT === "-1" ? null : {text: getLocalization('commands:send.success.footer', interaction.locale, {time: process.env.DELETE_BUTTON_TIMEOUT})})
                .setColor(process.env.ACCENT_COLOR);
            const deleteButton = new ButtonBuilder()
                .setCustomId(`delete-${message.id + isThread ? interaction.channel.id : ''}`)
                .setLabel(getLocalization('commands:send.success.delete', interaction.locale))
                .setEmoji('🗑️')
                .setStyle(ButtonStyle.Danger)
            await interaction.reply({embeds: [responseEmbed],components: [{type:1, components:[deleteButton]}], ephemeral: true});
            // wait 10s
            if (process.env.DELETE_BUTTON_TIMEOUT !== "-1") {
                await new Promise(resolve => setTimeout(resolve, process.env.DELETE_BUTTON_TIMEOUT*1000));
                await interaction.deleteReply();
            }
        } catch (e) {
            // check if error is due to missing permissions or if the channel don't support threads
            if (!(e.code === 50013 || e.code === 50046)) {
                console.log(e);
            }
            return interaction.reply(translated.text)
        }
    }
};
