//******Étape 1.1 : Récupération des travaux depuis le back-end

// Sélectionne l'élément div avec la classe .gallery et le stocke dans la variable divGallery
const divGallery = document.querySelector(".gallery");

// Variable globale pour stocker les projets récupérés
let allProjects = [];

// Fonction asynchrone pour récupérer les projets depuis l'API
async function collectProjects() {
    try {
        // Envoie une requête GET à l'API pour obtenir les projets
        const response = await fetch("http://localhost:5678/api/works");

        // Vérifie si la réponse n'est pas correcte (code HTTP 200-299)
        if (!response.ok) {
            // Si la réponse est incorrecte, lance une erreur avec le statut HTTP
            throw new Error(`HTTP error! URL works status: ${response.status}`);
        }

        // Convertit la réponse en format JSON
        const dataProjects = await response.json();
        console.log("Projects fetched:", dataProjects);

        // Stocke les projets dans la variable globale
        allProjects = dataProjects;

        // Affiche les projets dans la galerie
        displayProjects(allProjects);

        // Retourne les projets récupérés pour un usage ultérieur
        return allProjects;
    } catch (error) {
        // Affiche l'erreur dans la console s'il y a un problème
        console.log(error);
        return [];
    }
}

// Fonction pour afficher les projets dans le DOM (page HTML)
function displayProjects(projects) {
    // Vide la galerie avant d'afficher les projets
    divGallery.innerHTML = "";

    // Vérifie s'il y a des projets à afficher
    if (projects && projects.length > 0) {
        // Parcourt chaque projet et l'ajoute à la galerie
        projects.forEach(project => {
            // Crée un nouvel élément figure pour chaque projet
            const figure = document.createElement("figure");
            // Crée un élément img pour l'image du projet
            const img = document.createElement("img");
            // Crée un élément figcaption pour le titre du projet
            const figCaption = document.createElement("figcaption");

            // Définit les attributs de l'image du projet
            img.src = project.imageUrl;
            img.alt = project.title;

            // Définit le texte de la légende avec le titre du projet
            figCaption.textContent = project.title;

            // Définit l'ID de la figure avec l'ID du projet
            figure.id = project.id;

            // Ajoute l'image et la légende à la figure
            figure.appendChild(img);
            figure.appendChild(figCaption);

            // Ajoute la figure à la galerie
            divGallery.appendChild(figure);
        });
    } else {
        console.log("No projects to display");
    }
}

// Appelle la fonction collectProjects pour récupérer et afficher les projets au chargement de la page
collectProjects();

//****** Étape 1.2 : Réalisation du filtre des travaux : Ajout des filtres pour afficher les travaux par catégorie 

// Sélectionne l'élément div avec la classe .filters et le stocke dans la variable divFilters
const divFilters = document.querySelector(".filters");

// Fonction asynchrone pour récupérer les catégories depuis l'API
async function collectCategories() {
    try {
        // Envoie une requête GET à l'API pour obtenir les catégories
        const response = await fetch("http://localhost:5678/api/categories");

        // Vérifie si la réponse n'est pas correcte (code HTTP 200-299)
        if (!response.ok) {
            // Si la réponse est incorrecte, lance une erreur avec le statut HTTP
            throw new Error(`HTTP error! URL categories status: ${response.status}`);
        }

        // Convertit la réponse en format JSON
        const dataCategories = await response.json();
        console.log("Categories fetched:", dataCategories);

        // Affiche les catégories dans le conteneur de filtres
        displayCategories(dataCategories);

        // Retourne les catégories récupérées pour un usage ultérieur
        return dataCategories;
    } catch (error) {
        // Affiche l'erreur dans la console s'il y a un problème
        console.log(error);
        return [];
    }
}

// Fonction pour afficher les catégories dans le DOM (page HTML)
function displayCategories(categories) {
    // Vide le conteneur de filtres avant d'ajouter les catégories
    divFilters.innerHTML = "";

    // Crée et ajoute un bouton pour afficher tous les projets
    const btnAll = document.createElement("button");
    btnAll.textContent = "TOUS"; // Texte du bouton
    btnAll.id = "0"; // ID du bouton pour tous les projets
    divFilters.appendChild(btnAll);

    // Vérifie s'il y a des catégories à afficher
    if (categories && categories.length > 0) {
        // Parcourt chaque catégorie et crée un bouton pour chacune
        categories.forEach(category => {
            const btnCategory = document.createElement("button");
            btnCategory.textContent = category.name; // Texte du bouton avec le nom de la catégorie
            btnCategory.id = category.id; // ID du bouton avec l'ID de la catégorie
            divFilters.appendChild(btnCategory); // Ajoute le bouton au conteneur de filtres
        });
    } else {
        console.log("No categories to display");
    }

    // Initialise les écouteurs d'événements pour les boutons de filtre
    initFilterCategory();
}

// Fonction pour initialiser les écouteurs d'événements sur les boutons de filtres
function initFilterCategory() {
    // Sélectionne tous les boutons dans le conteneur de filtres
    const allButtons = document.querySelectorAll(".filters button");

    // Ajoute un écouteur d'événement de clic à chaque bouton
    allButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const buttonsId = e.target.id; // Récupère l'ID du bouton cliqué
            divGallery.innerHTML = ""; // Vide la galerie avant d'afficher les projets filtrés

            // Si l'ID du bouton cliqué n'est pas "0", filtre les projets par catégorie
            if (buttonsId !== "0") {
                // Filtre les projets selon l'ID de la catégorie
                const galleryFilter = allProjects.filter(project => project.categoryId == buttonsId);

                // Affiche les projets filtrés
                if (galleryFilter.length > 0) {
                    displayProjects(galleryFilter);
                } else {
                    console.log("No projects found for this category");
                }
            } else {
                // Si l'ID du bouton est "0", affiche tous les projets
                displayProjects(allProjects);
            }
        });
    });
}

// Appelle la fonction collectCategories pour récupérer et afficher les catégories au chargement de la page
collectCategories();

