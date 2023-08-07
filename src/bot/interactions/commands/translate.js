const { SlashCommandBuilder } = require('discord.js');
const { translate } = require('../../../api/api.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate your message to the language of your choice privately..')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to translate.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('to')
                .setDescription('The lang to translate to.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('from')
                .setDescription('The lang to translate from (default: auto).')
                .setRequired(false)),
    async execute(interaction) {
        //    translate
        const text = interaction.options.getString('text');
        const to = interaction.options.getString('to');
        //    ,
        const from = interaction.options.getString('from') || 'auto';

        const translated = await translate(text, to, from);
        await interaction.reply({ content: translated.text, ephemeral: true});
    },
};
