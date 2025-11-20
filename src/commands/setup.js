const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Configure le salon et le rôle à mentionner')
        // Option 1 : Le salon
        .addChannelOption(option => 
            option.setName('channel').setDescription('Le salon où envoyer le quiz').setRequired(true))
        // Option 2 : Le rôle (C'est celle-ci qui manquait à Discord)
        .addRoleOption(option => 
            option.setName('role').setDescription('Le rôle à mentionner (optionnel)').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
        const roleId = role ? role.id : null;

        db.setConfig(interaction.guild.id, channel.id, roleId);

        let msg = `✅ Configuré ! Le quiz sera envoyé dans ${channel}.`;
        if (role) {
            msg += `\n🔔 Le rôle **${role.name}** sera mentionné.`;
        }

        await interaction.reply(msg);
    },
};