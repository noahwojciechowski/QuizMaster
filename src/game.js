const { ActionRowBuilder, UserSelectMenuBuilder, EmbedBuilder, ComponentType } = require('discord.js');
const db = require('./db');

// ⏱️ TEMPS DE VOTE (5 minutes)
const VOTE_DURATION = 12 * 60 * 60 * 1000; 

const botComments = [
    "Le peuple a parlé.", "Les statistiques ne mentent jamais.", "C'est dur, mais c'est la vérité.",
    "On t'aime quand même.", "Fallait s'y attendre..."
];

async function startDailyQuiz(client, guildId, manualChannelId = null) {
    // 1. Configuration
    let channelId = manualChannelId;
    let roleId = null;

    if (!channelId) {
        const config = db.getConfig(guildId);
        if (!config) return console.log(`[Quiz] Pas de config pour ${guildId}`);
        channelId = config.channel_id;
        roleId = config.role_id; 
    }

    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) return console.log("[Quiz] Canal introuvable.");

    // 2. Question
    const question = db.getRandomQuestion();
    
     const endTime = Math.floor((Date.now() + VOTE_DURATION) / 1000);

    const generateStatus = (votesMap) => {
        if (votesMap.size === 0) return "👻 Pas encore de votes...";
        const sorted = Array.from(votesMap.entries()).sort((a, b) => b[1].count - a[1].count);
        return sorted.map(([id, data]) => {
            // On affiche le nom en texte simple (pas de mention)
            const voterNames = data.voterNames.join(', ');
            return `**${data.targetName}** (${data.count}) : *${voterNames}*`;
        }).join('\n');
    };

    // 3. Interface
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setDescription(`### ${question.text}\n\n🗳️ **Votez ci-dessous !**\n⏳ **Fin à :** <t:${endTime}:t>`)
        .addFields({ name: '📊 Votes en direct', value: 'En attente du premier vote...' })


    // On utilise le menu standard qui permet de chercher n'importe qui
    const userSelect = new UserSelectMenuBuilder()
        .setCustomId('vote_select')
        .setPlaceholder('Recherche le coupable...')
        .setMaxValues(1);

    const row = new ActionRowBuilder().addComponents(userSelect);

    const messageOptions = { 
        embeds: [embed], 
        components: [row],
        allowedMentions: { parse: ['roles', 'users'] } 
    };
    
    // Le rôle sert juste à notifier que le quiz commence (et à restreindre qui peut CLIQUER si tu veux)
    if (roleId) messageOptions.content = `🔔 Quiz du jour ! <@&${roleId}>`;

    const message = await channel.send(messageOptions);

    // 4. Collecteur
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.UserSelect,
        time: VOTE_DURATION
    });

    const votes = new Map(); 
    const voters = new Set(); 

    collector.on('collect', async i => {
        // SÉCURITÉ VOTEUR (Optionnel : seul le rôle peut cliquer)
        // Si tu veux que TOUT LE MONDE puisse voter, supprime ce bloc if
        if (roleId && !i.member.roles.cache.has(roleId)) {
            return i.reply({ content: `⛔ Tu ne participes pas ! Réservé au rôle <@&${roleId}>.`, ephemeral: true });
        }

        if (voters.has(i.user.id)) return i.reply({ content: '🚫 Tu as déjà voté !', ephemeral: true });

        const selectedUserId = i.values[0];
        let selectedMember;
        
        try { selectedMember = await i.guild.members.fetch(selectedUserId); } 
        catch (e) { return i.reply({ content: '❓ Introuvable.', ephemeral: true }); }

        // SÉCURITÉ CIBLE : Juste les bots
        if (selectedMember.user.bot) return i.reply({ content: '🤖 Pas de vote pour les bots !', ephemeral: true });
        
        // ❌ J'ai supprimé la vérification du rôle de la cible ici.
        // On peut donc voter pour n'importe qui.

        // VALIDATION
        voters.add(i.user.id);
        
        const currentData = votes.get(selectedUserId) || { count: 0, targetName: selectedMember.displayName, voterNames: [] };
        currentData.count++;
        // On stocke le nom d'affichage (displayName) pour l'affichage
        currentData.voterNames.push(i.member.displayName); 
        
        votes.set(selectedUserId, currentData);

        await i.update({ embeds: [new EmbedBuilder(embed.data).setFields({ name: '📊 Votes en direct', value: generateStatus(votes) })] });
    });

    collector.on('end', async () => {
        if (votes.size === 0) {
            const endEmbed = new EmbedBuilder(embed.data).setColor('#808080').setDescription(`### ${question.text}\n\n⌛ **Temps écoulé ! 0 vote.**`);
            return message.edit({ embeds: [endEmbed], components: [] });
        }

        const sortedResults = Array.from(votes.entries()).sort((a, b) => b[1].count - a[1].count);
        
        let resultText = "";
        const medals = ['🥇', '🥈', '🥉'];

        sortedResults.slice(0, 3).forEach((res, index) => {
            const medal = medals[index] || '🏅';
            // Affichage propre sans mention (<@...>)
            resultText += `${medal} **${res[1].targetName}** (${res[1].count}) : \n└ *Voté par : ${res[1].voterNames.join(', ')}*\n\n`;
        });

        const winnerId = sortedResults[0][0];
        const winnerData = sortedResults[0][1];
        
        // Récupération Avatar
        const winnerUser = await message.guild.members.fetch(winnerId).catch(() => null);
        const avatarUrl = winnerUser ? winnerUser.user.displayAvatarURL({ dynamic: true, size: 256 }) : null;

        const randomComment = botComments[Math.floor(Math.random() * botComments.length)];

        const resultEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`🏆 Résultats : "${question.text}"`)
            .setDescription(resultText)
            .setThumbnail(avatarUrl)
            .addFields({ name: '🤖 Analyse', value: `*${winnerData.targetName}, ${randomComment}*` });

        await channel.send({ embeds: [resultEmbed] });
        
        const finalStateEmbed = new EmbedBuilder(embed.data)
            .setTitle('🛑 Sondage terminé')
            .setFields({ name: '📊 Votes finaux', value: generateStatus(votes) });
            
        await message.edit({ components: [], embeds: [finalStateEmbed] });
    });
}

module.exports = { startDailyQuiz };