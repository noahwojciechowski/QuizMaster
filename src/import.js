const fs = require('fs');
const db = require('./db');

const rawData = fs.readFileSync('questions_list.json');
const questions = JSON.parse(rawData);

console.log(`🔄 Importation de ${questions.length} questions...`);

let count = 0;
questions.forEach(q => {
    const result = db.addQuestion(q);
    if (result.changes > 0) count++;
});

console.log(`✅ ${count} nouvelles questions ajoutées à la base de données !`);