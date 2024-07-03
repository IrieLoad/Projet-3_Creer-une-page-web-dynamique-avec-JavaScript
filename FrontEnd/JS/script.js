// Sélectionne l'élément div avec la classe .gallery et le stocke dans la variable divGallery
const divGallery = document.querySelector(".gallery");

// Définition d'une fonction asynchrone nommée collectProject
async function collectProject() {
    try {
        // Effectue une requête HTTP GET vers l'URL spécifiée pour récupérer les projets
        const response = await fetch("http://localhost:5678/api/works");

        // Vérifie si la réponse n'est pas OK (statut HTTP 200-299)
        if (!response.ok) {
            // Si la réponse n'est pas OK, lance une erreur avec le statut HTTP
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Extrait les données JSON de la réponse
        const data = await response.json();

        // Appelle la fonction displayProject avec les données récupérées
        displayProject(data);
    } catch (error) {
        // Si une erreur se produit, l'affiche dans la console
        console.log(error);
    }
}

// Fonction pour afficher les projets dans le DOM
function displayProject(projects) {
    // Boucle à travers la liste des projets et ajoute chaque projet à la galerie
    for (let i = 0; i < projects.length; i++) {
        // Crée un nouvel élément figure pour chaque projet
        const figure = document.createElement("figure");
        // Crée un nouvel élément img pour l'image du projet
        const img = document.createElement("img");
        // Crée un nouvel élément figcaption pour le titre du projet
        const figCaption = document.createElement("figcaption");

        // Assigne l'URL de l'image du projet à l'attribut src de l'élément img
        img.src = projects[i].imageUrl;
        // Assigne le titre du projet à l'attribut alt de l'élément img pour l'accessibilité
        img.alt = projects[i].title;
        // Assigne le titre du projet au contenu textuel de l'élément figcaption
        figCaption.textContent = projects[i].title;
        // Assigne l'ID du projet à l'attribut id de l'élément figure
        figure.id = projects[i].id;

        // Ajoute l'élément img comme enfant de l'élément figure
        figure.appendChild(img);
        // Ajoute l'élément figcaption comme enfant de l'élément figure
        figure.appendChild(figCaption);
        // Ajoute l'élément figure comme enfant de la div .gallery
        divGallery.appendChild(figure);
    }
}

// Appel de la fonction collectProject pour démarrer le processus de récupération et d'affichage des projets
collectProject();

