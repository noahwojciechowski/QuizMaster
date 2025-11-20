const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list_questions')
        .setDescription('Affiche toutes les questions en base'),
    async execute(interaction) {
        const questions = db.getQuestions();
        const list = questions.map(q => `- ${q.text}`).join('\n');
        
        // Attention à la limite de 4096 caractères de Discord, on tronque si besoin
        const display = list.length > 2000 ? list.substring(0, 2000) + "..." : list;
        
        await interaction.reply({ content: `**Questions disponibles :**\n${display}`, ephemeral: true });
    },
};