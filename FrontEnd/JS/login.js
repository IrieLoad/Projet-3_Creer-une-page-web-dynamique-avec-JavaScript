/****** Étape 2.2 : Authentification de l’utilisateur*****/

// Sélectionne les éléments HTML du formulaire de connexion
const email = document.querySelector("form #email"); // Champ de saisie pour l'email
const password = document.querySelector("form #password"); // Champ de saisie pour le mot de passe
const form = document.querySelector("form"); // Formulaire de connexion
const errorMessage = document.querySelector(".login-section p"); // Paragraphe pour afficher les messages d'erreur

// Fonction pour gérer la soumission du formulaire
form.addEventListener("submit", function (e) {
    e.preventDefault(); // Empêche le formulaire de recharger la page

    // Récupère les valeurs des champs de saisie
    const usersEmail = email.value; // Récupère la valeur du champ email
    const usersPassword = password.value; // Récupère la valeur du champ mot de passe

    // Log les valeurs récupérées
    //console.log("Email:", usersEmail);
    //console.log("Password:", usersPassword);

    // Vérifie si les champs email et mot de passe sont vides
    if (usersEmail === "" || usersPassword === "") {
        console.log("Un des champs est vide")
        // Si l'un des champs est vide, affiche un message d'erreur
        errorMessage.textContent = "Veuillez remplir tous les champs."; // Définit le texte du message d'erreur
        errorMessage.style.color = 'red'; // Change la couleur du texte du message d'erreur en rouge
        return; // Stoppe l'exécution de la fonction pour éviter d'envoyer une requête vide
    }
    
    // Envoie une requête de connexion à l'API
    fetch("http://localhost:5678/api/users/login", {
        method: 'POST', // Méthode de requête POST
        headers: {
            "Content-Type": "application/json" // Spécifie le type de contenu comme JSON
        },
        body: JSON.stringify({
            email: usersEmail, // Données saisies pour l'email
            password: usersPassword // Données saisies pour le mot de passe
        })
    })
    .then(function (response) {
        //console.log("Response status:", response.status);
        // Vérifie si la réponse est correcte (status code 200-299)
        if (response.ok) {
            return response.json(); // Convertit la réponse en format JSON
        } 
        else {
            // Si la réponse n'est pas correcte, lance une erreur
            throw new Error("Erreur dans l’identifiant ou le mot de passe");
        }
    })
    .then(function (data) {
        //console.log("Data received:", data); //
        // Si la connexion est réussie, stocke le token d'authentification
        window.localStorage.setItem("authToken", data.token); // Stocke le token dans le stockage local
        //console.log("Le token a été stocké dans le localstorage:", window.localStorage.getItem('authToken'));
        location.href = "homepage-edit.html"; // Redirige l'utilisateur vers la page d'accueil
        //console.log("Redirection vers la page d'accueil");
    })
    .catch(function (error) {
        console.error('Error:', error); // Log l'erreur
        // Affiche le message d'erreur en cas d'échec de la connexion
        errorMessage.textContent = error.message; // Définit le texte du message d'erreur
        errorMessage.style.color = 'red'; // Change la couleur du texte du message d'erreur en rouge
    });
});
