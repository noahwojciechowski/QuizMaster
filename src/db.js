const Database = require('better-sqlite3');
const db = new Database('quizmaster.sqlite');

// 1. Initialisation des tables (On ne garde que la config et les questions)
db.exec(`
  CREATE TABLE IF NOT EXISTS guild_config (
    guild_id TEXT PRIMARY KEY,
    channel_id TEXT,
    role_id TEXT
  );
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT UNIQUE,
    last_used INTEGER DEFAULT 0
  );
`);

// Questions par défaut
const defaultQuestions = [
    "Qui s’énerve le plus sous pression ?",
    "Qui met toujours 10 ans à répondre ?",
    "Qui survivrait le moins longtemps à Koh Lanta ?",
    "Qui ferait le pire président ?",
    "Qui rage-quit le plus souvent ?",
    "Qui raconte les pires blagues ?",
    "Qui a le plus de dossiers compromettants ?",
    "Qui oublierait son mot de passe même noté ?",
    "Qui serait un bon espion ?",
    "Qui serait le premier à mourir dans un film d’horreur ?"
];

const insertQ = db.prepare("INSERT OR IGNORE INTO questions (text) VALUES (?)");
defaultQuestions.forEach(q => insertQ.run(q));

module.exports = {
    setConfig: (guildId, channelId, roleId) => {
        db.prepare("INSERT OR REPLACE INTO guild_config (guild_id, channel_id, role_id) VALUES (?, ?, ?)").run(guildId, channelId, roleId);
    },
    getConfig: (guildId) => {
        return db.prepare("SELECT channel_id, role_id FROM guild_config WHERE guild_id = ?").get(guildId);
    },
    addQuestion: (text) => {
        return db.prepare("INSERT OR IGNORE INTO questions (text) VALUES (?)").run(text);
    },
    getQuestions: () => {
        return db.prepare("SELECT * FROM questions").all();
    },
    // Smart Shuffle (Mélange intelligent)
    getRandomQuestion: () => {
        const candidates = db.prepare("SELECT * FROM questions ORDER BY last_used ASC LIMIT 5").all();
        if (candidates.length === 0) return { text: "Aucune question disponible !" };
        const selected = candidates[Math.floor(Math.random() * candidates.length)];
        db.prepare("UPDATE questions SET last_used = ? WHERE id = ?").run(Date.now(), selected.id);
        return selected;
    }
};