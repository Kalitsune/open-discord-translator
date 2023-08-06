const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Tweak the bot settings.'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
