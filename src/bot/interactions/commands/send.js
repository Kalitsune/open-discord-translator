const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Translate your message and sends it under your name.'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
