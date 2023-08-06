const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate your message to the language of your choice privately.'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
