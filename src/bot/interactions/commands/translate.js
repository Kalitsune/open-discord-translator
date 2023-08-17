const { SlashCommandBuilder } = require('discord.js');

const { getKeyLocalizations } = require('../../../localizations/localizations.js');
const { makeResponseEmbeds } = require('../../../utils');

module.exports = {
    init (client) {
        //get the country codes
        let languages = client.languages.map((lang) => {return {name: lang.name, value: lang.code}});
        // edit the command
        const command = client.commands.get('translate');
        // transform the sources/targets into choices {name, value}
        command.data.options[1].choices = languages
        command.data.options[2].choices = languages
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
        const from = interaction.options.getString('from');

        const translated = await interaction.client.translate(text, to, from);

        await interaction.reply({ embeds: makeResponseEmbeds(interaction.locale, translated.from, to, translated.text), ephemeral: true});
    },
};