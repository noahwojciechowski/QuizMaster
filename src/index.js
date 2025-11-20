require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const db = require('./db');
const { startDailyQuiz } = require('./game');

// Création du client avec les intents nécessaires
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Ajouté grâce à ta config
        GatewayIntentBits.GuildMembers    // Ajouté pour bien gérer les membres
    ] 
});

client.commands = new Collection();

// Chargement des commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Événement : Bot prêt
client.once('ready', () => {
    console.log(`🤖 QuizMaster connecté en tant que ${client.user.tag}`);

    // Planification : Tous les jours à 10h00
    // Syntaxe Cron : Minute Heure Jour Mois Semaine
        cron.schedule('0 10 * * *', () => {
            console.log("⏰ Il est 10h, lancement du Quiz !");
            client.guilds.cache.forEach(guild => {
            startDailyQuiz(client, guild.id);
        });
    }, {
        timezone: "Europe/Paris" // Adapte selon ta zone
    });
});

// Gestion des interactions (Commandes Slash)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Erreur lors de l\'exécution de la commande.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);