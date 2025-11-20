const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { startDailyQuiz } = require('../game');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('force_question')
        .setDescription('Force l\'envoi d\'une question immédiatement')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.reply({ content: '🚀 Lancement d\'une question immédiate !', ephemeral: true });
        await startDailyQuiz(interaction.client, interaction.guild.id, interaction.channel.id);
    },
};