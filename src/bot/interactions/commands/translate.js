const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getKeyLocalizations } = require('../../../localizations/localizations.js');

module.exports = {
    init (client) {
        //get the country codes
        let sources = client.languages.sources;
        if (sources.length > 25) sources.length = 25;

        let targets = client.languages.targets;
        if (targets.length > 25) targets.length = 25;

        // edit the command
        const command = client.commands.get('translate');
        // transform the sources/targets into choices {name, value}
        targets.map((lang) => {return {name: lang.language, value: lang.code}}).forEach(choice => command.data.options[1].addChoices(choice));
        sources.map((lang) => {return {name: lang.language, value: lang.code}}).forEach(choice => command.data.options[2].addChoices(choice));
    },
    data: new SlashCommandBuilder()
        .setName('translate').setDescription("Translate text to another language.")
        .setNameLocalizations(getKeyLocalizations('commands:translate.name'))
        .setDescriptionLocalizations(getKeyLocalizations('commands:translate.description'))
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

        //make the embed
        const responseEmbed = new EmbedBuilder().setColor(process.env.ACCENT_COLOR)
            .addFields({ name: `Translated  ${getFlagEmoji(translated.from)}  → ${getFlagEmoji(to)}`, value: translated.text})
        await interaction.reply({ embeds: [responseEmbed], ephemeral: true});
    },
};


function getFlagEmoji (countryCode) {
    // en is not a flag so pick gb/us instead
    if (countryCode === 'en') countryCode = ['gb','us'][Math.floor(Math.random()*2)];

    return countryCode.replace(/./g,(ch)=>String.fromCodePoint(0x1f1a5+ch.toUpperCase().charCodeAt()))
}