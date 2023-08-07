const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate your message to the language of your choice privately.')
        .addStringOption(option =>
            option.setName('to')
                .setDescription('The lang to translate to.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('from')
                .setDescription('The lang to translate from (default: auto)')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
