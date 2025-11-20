# 🎲 QuizMaster Bot

![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

**QuizMaster** est un bot Discord communautaire fun inspiré des jeux **Jackbox** (type *Qui est le plus susceptible de...*).
Son but est d'animer votre serveur quotidiennement en posant une question décalée et en laissant les membres voter pour leurs amis.

---

## ✨ Fonctionnalités Principales

*   📅 **Routine Automatique :** Envoie une question chaque matin à **10h00** (Heure Paris).
*   🗳️ **Système de Vote :** Les membres votent via un menu déroulant. Les votes sont publics et affichés en temps réel.
*   ⏳ **Durée de 12h :** Les votes sont ouverts toute la journée. À **22h00**, le bot clôture le sondage.
*   🏆 **Résultats Visuels :** Le "gagnant" (la personne la plus votée) est affiché avec son avatar en grand et un podium des 3 premiers.
*   🧠 **Smart Shuffle :** Le bot ne pose jamais la même question deux fois de suite grâce à une gestion intelligente de la base de données.
*   🔒 **Sécurité & Rôles :** Possibilité de restreindre qui peut voter et qui peut être voté via un rôle spécifique (ex: `@Joueurs`).

---

## 🛠️ Liste des Commandes

| Commande | Description | Permission |
| :--- | :--- | :--- |
| `/setup` | Configure le salon d'envoi et le rôle requis pour jouer. | **Admin** |
| `/force_question` | Lance une question immédiatement (pour tester ou jouer hors horaires). | **Admin** |
| `/add_question` | Ajoute une nouvelle question à la base de données. | Tout le monde |
| `/delete_last_question` | Supprime la dernière question ajoutée (en cas d'erreur). | **Admin** |
| `/list_questions` | Affiche la liste de toutes les questions disponibles. | Tout le monde |

---
