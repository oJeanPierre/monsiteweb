console.log("🔵 login.js chargé !");

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log("📩 Réponse du serveur :", data); // DEBUG

        if (data.success) {
            console.log("✅ Utilisateur authentifié, type :", data.type); // DEBUG

            // Stocke le type de l'utilisateur pour plus tard
            localStorage.setItem("userType", data.type);

            // Redirige vers global.html
            window.location.href = "global.html";
        } else {
            alert("Identifiants incorrects !");
        }
    } catch (error) {
        console.error("❌ Erreur lors de la requête :", error);
    }
});
