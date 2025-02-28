const express = require("express");
const path = require("path"); // 🔥 Manquait cette ligne
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json()); // Permet de lire req.body correctement
app.use(express.json());
app.use(cors());
const fs = require('fs'); // Ajoute ça en haut si ce n'est pas déjà fait

app.post('/login', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error("❌ Erreur de lecture du fichier :", err);
            return res.status(500).json({ error: "Erreur de lecture du fichier", details: err.message });
        }

        console.log("📂 Contenu brut du fichier :", data);

        try {
            const users = JSON.parse(data);
            const { username, password } = req.body;
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                console.log("✅ Utilisateur trouvé :", user);
                res.json({ 
                    success: true, 
                    message: "Connexion réussie", 
                    type: user.type // Ici on envoie bien le type de l'utilisateur
                });
            } else {
                console.log("❌ Identifiants incorrects");
                res.status(401).json({ success: false, error: "Identifiants incorrects" });
            }
        } catch (parseError) {
            console.error("❌ Erreur de parsing JSON :", parseError);
            res.status(500).json({ error: "Erreur de parsing du fichier JSON" });
        }
    });
});





const dataFile = 'data.json';

// 📌 Fonction pour lire `data.json` et s'assurer que c'est bien un tableau
function lireFichier(callback) {
    fs.readFile(dataFile, 'utf8', (err, data) => {
        if (err || data.trim().length === 0) {
            console.warn('⚠️ Fichier vide ou introuvable → Création d\'un tableau vide.');
            return callback([]); // Retourne un tableau vide si fichier inexistant ou vide
        }
        try {
            const jsonData = JSON.parse(data);
            if (!Array.isArray(jsonData)) throw new Error('Format JSON invalide (doit être un tableau)');
            callback(jsonData);
        } catch (error) {
            console.error('❌ Erreur JSON:', error);
            return callback([]); // Si fichier corrompu, on remet un tableau vide
        }
    });
}

// 📌 Fonction pour écrire dans `data.json` en forçant un tableau
function ecrireFichier(donnees, res, message) {
    fs.writeFile(dataFile, JSON.stringify(donnees, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('❌ Erreur d\'écriture:', err);
            return res.status(500).json({ error: 'Erreur d\'écriture du fichier' });
        }
        res.json({ message, donnees });
    });
}

// ✅ Route pour AJOUTER une nouvelle entrée sans écraser les autres
app.post('/add', (req, res) => {
    lireFichier(donnees => {
        const nouvelleEntree = req.body;
        
        // Vérifie que l'ID est unique
        if (donnees.some(item => item.id === nouvelleEntree.id)) {
            return res.status(400).json({ error: 'ID déjà existant' });
        }

        donnees.push(nouvelleEntree); // Ajout au tableau
        ecrireFichier(donnees, res, 'Nouvelle donnée ajoutée');
    });
});

// ✅ Route pour METTRE À JOUR une entrée sans supprimer les autres
app.post('/update', (req, res) => {
    lireFichier(donnees => {
        let index = donnees.findIndex(item => item.id === req.body.id);

        if (index !== -1) {
            donnees[index] = { ...donnees[index], ...req.body }; // Mise à jour
            ecrireFichier(donnees, res, 'Données mises à jour');
        } else {
            return res.status(404).json({ error: 'ID non trouvé' });
        }
    });
});

// ✅ Route pour SUPPRIMER une entrée
app.post('/delete', (req, res) => {
    lireFichier(donnees => {
        let newDonnees = donnees.filter(item => item.id !== req.body.id);

        if (newDonnees.length === donnees.length) {
            return res.status(404).json({ error: 'ID non trouvé' });
        }

        ecrireFichier(newDonnees, res, 'Donnée supprimée');
    });
});

// ✅ Route pour LISTER toutes les données
app.get('/data', (req, res) => {
    lireFichier(donnees => res.json(donnees));
});

// 📌 Vérifie et corrige `data.json` au démarrage
fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err || data.trim().length === 0 || !data.startsWith('[')) {
        console.warn('⚠️ Correction automatique de `data.json`.');
        fs.writeFileSync(dataFile, '[]', 'utf8'); // Force un tableau vide si problème
    }
});

// 🔥 Démarrer le serveur
app.listen(3000, () => console.log('✅ Serveur actif sur http://localhost:3000'));



const filePath = path.join(__dirname, "users.json");
let users = [];

try {
    const data = fs.readFileSync(filePath, "utf8");
    console.log("📂 Contenu brut du fichier :", data); // 🔍 Voir ce qui est lu
    users = JSON.parse(data);
    console.log("✅ Utilisateurs chargés :", users);
} catch (error) {
    console.error("❌ Erreur en lisant users.json :", error); // 🔍 Voir l'erreur exacte
}

