// 🔹 Charger les données depuis le serveur et les afficher
fetch('http://localhost:3000/data') // Effectue une requête GET vers l'API locale
    .then(response => response.json()) // Convertit la réponse en JSON
    .then(data => afficherDonnees(data)) // Appelle la fonction pour afficher les données
    .catch(error => console.error('Erreur:', error)); // Affiche une erreur si la requête échoue

// 🔹 Fonction pour afficher les données dans le tableau
function afficherDonnees(donnees) {
    let tableBody = document.getElementById('table-body'); // Sélectionne le <tbody> du tableau
    tableBody.innerHTML = ''; // Vide le tableau avant d'ajouter les nouvelles données

    // Parcourt chaque élément de la liste de données reçues
    donnees.forEach(item => {
        let row = document.createElement('tr'); // Crée une nouvelle ligne de tableau
        // Remplit la ligne avec les données de l'utilisateur
        row.innerHTML = `<td>${item.id}</td><td>${item.nom}</td><td>${item.age}</td>`;
        tableBody.appendChild(row); // Ajoute la ligne au tableau
    });
}

// 🔹 Fonction pour afficher la date actuelle formatée en français
function afficherDate() {
    let maintenant = new Date(); // Crée un objet Date représentant la date actuelle
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; 
    // Définit le format d'affichage (jour de la semaine, année, mois, jour)
    document.getElementById('date').innerText = maintenant.toLocaleDateString('fr-FR', options); 
    // Affiche la date formatée dans l'élément <p id="date">
}

afficherDate(); // Appelle la fonction pour afficher immédiatement la date

// 🔹 Fonction pour afficher un message spécial si l'utilisateur est du type "2"
function jetaime() {
    const userType = localStorage.getItem("userType"); // Récupère le type d'utilisateur depuis localStorage
    if (userType === "2") { // Vérifie si l'utilisateur a le type "2"
        let phrase = "Je t'aime Princesse"; // Message spécial
        document.getElementById('jtm').innerText = phrase; // Affiche le message dans l'élément <p id="jtm">
    }
}

jetaime(); // Exécute immédiatement la fonction pour afficher le message si applicable

// 🔹 Fonction pour ajouter un utilisateur (exemple)
function ajouterUtilisateur() {
    let newUser = { id: 3, nom: "Charlie", age: 22 }; // Définition d'un nouvel utilisateur

    fetch('http://localhost:3000/update', { // Envoie une requête POST à l'API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...donneesActuelles, newUser]) // Ajoute le nouvel utilisateur aux données existantes
    }).then(() => location.reload()); // Recharge la page pour afficher les nouvelles données
}

// 🔹 Écouter la soumission du formulaire pour modifier une entrée
document.getElementById('edit-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupère les valeurs du formulaire
    const id = document.getElementById('id').value;
    const nom = document.getElementById('nom').value;
    const age = document.getElementById('age').value;

    // Envoie les nouvelles données au serveur
    fetch('http://localhost:3000/update', {
        method: 'POST', // Méthode POST pour envoyer des données
        headers: { 'Content-Type': 'application/json' }, // Indique qu'on envoie du JSON
        body: JSON.stringify({ id: parseInt(id), nom, age: parseInt(age) }) // Convertit l'ID et l'âge en nombres
    })
    .then(response => response.json()) // Convertit la réponse en JSON
    .then(data => {
        console.log('Données mises à jour:', data); // Affiche la réponse du serveur
        alert('Modification réussie !'); // Affiche une alerte de confirmation
        location.reload(); // Recharge la page pour voir les changements
    })
    .catch(error => console.error('Erreur:', error)); // Gère les erreurs en les affichant
});

// 🔹 Fonction pour charger les données depuis le serveur et les afficher
function fetchData() {
    fetch('http://localhost:3000/data') // Requête GET vers l'API
        .then(response => response.json()) // Convertit la réponse en JSON
        .then(data => afficherDonnees(data)) // Affiche les données dans le tableau
        .catch(error => console.error('Erreur:', error)); // Gère les erreurs
}

// 🔹 Charger les données dès que la page est ouverte
fetchData();
