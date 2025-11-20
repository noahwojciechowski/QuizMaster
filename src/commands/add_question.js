const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_question')
        .setDescription('Ajoute une nouvelle question à la base')
        .addStringOption(option => 
            option.setName('texte').setDescription('La question').setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('texte');
        db.addQuestion(text);
        await interaction.reply(`✅ Question ajoutée : "${text}"`);
    },
};