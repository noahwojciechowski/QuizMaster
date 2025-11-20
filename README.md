🎲 QuizMaster Bot
![alt text](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)

![alt text](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

![alt text](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
QuizMaster est un bot Discord fun et communautaire inspiré des jeux Jackbox.
Son but est d'animer votre serveur quotidiennement en posant une question de type "Qui est le plus susceptible de..." et en laissant les membres voter pour leurs amis.
✨ Fonctionnalités
📅 Routine Quotidienne : Envoie automatiquement une question chaque matin à 10h00.
🗳️ Système de Vote : Les membres votent via un menu déroulant (anonymat impossible, les votes sont publics !).
⏳ Durée de 12h : Les votes sont ouverts toute la journée.
🏆 Résultats Automatiques : À 22h00, le bot clôture les votes et affiche le "gagnant" du jour avec sa photo de profil en grand.
🧠 Smart Shuffle : Le bot ne pose jamais la même question deux fois de suite (système de rotation intelligente via SQLite).
🔒 Restriction par Rôle : Possibilité de restreindre les votes et les cibles à un rôle spécifique (ex: @Joueurs).
⚡ Temps Réel : Le message de vote se met à jour instantanément pour afficher qui a voté pour qui.
🛠️ Commandes Slash
Commande	Description	Permission
/setup	Définit le salon d'envoi et le rôle des participants.	Admin
/force_question	Lance une question immédiatement (pour tester).	Admin
/add_question	Ajoute une nouvelle question à la base de données.	Tout le monde
/delete_last_question	Supprime la dernière question ajoutée (en cas d'erreur).	Admin
/list_questions	Affiche la liste de toutes les questions en base.	Tout le monde
🚀 Installation & Hébergement
Prérequis
Node.js v16.9.0 ou supérieur.
Un Bot créé sur le Discord Developer Portal.
1. Installation locale
Clonez le projet et installez les dépendances :
code
Bash
git clone https://github.com/VOTRE_PSEUDO/QuizMaster.git
cd QuizMaster
npm install
2. Configuration
Créez un fichier .env à la racine du projet et ajoutez vos clés :
code
Ini
DISCORD_TOKEN=votre_token_ici
CLIENT_ID=votre_id_application_ici
⚠️ Important : Ne jamais partager ce fichier sur GitHub.
3. Base de données & Questions
Le bot utilise SQLite (fichier local quizmaster.sqlite).
Pour importer une liste massive de questions au démarrage :
Placez un fichier questions_list.json à la racine.
Lancez le script d'import :
code
Bash
node src/import.js
4. Lancement
Pour enregistrer les commandes slash sur Discord (à faire une fois) :
code
Bash
node src/deploy-commands.js
Pour lancer le bot :
code
Bash
node src/index.js
☁️ Déploiement (Production)
Ce bot est conçu pour tourner 24h/24 (pour respecter les horaires 10h-22h).
Il est recommandé d'utiliser un VPS ou un hébergeur supportant le stockage persistant (pour la base de données SQLite).
Hébergement recommandé : AlwaysData, VPS OVH, ou tout serveur Linux.
Outil recommandé : PM2 pour garder le bot en ligne.
code
Bash
# Installation de PM2
npm install pm2 -g

# Lancement
pm2 start src/index.js --name QuizMaster
pm2 save
pm2 startup