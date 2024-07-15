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

//****** Étape 3.1 : Ajout de la fenêtre modale. 

let modal = null; // Variable pour stocker la référence de la modale ouverte

const openModal = function (e) {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    console.log("Ouverture de la modale");

    const target = document.querySelector(e.currentTarget.getAttribute('href')); // Trouve l'élément cible de la modale
    if (!target) { // Vérifie si la modale cible existe
        console.error("Modale non trouvée");
        return;
    }

    target.style.display = null; // Affiche la modale en réinitialisant le style display
    target.removeAttribute('aria-hidden'); // Rend la modale visible pour les lecteurs d'écran
    target.setAttribute('aria-modal', 'true'); // Indique que c'est une modale
    modal = target; // Stocke la référence de la modale
    modal.addEventListener('click', closeModal); // Ajoute un écouteur d'événement pour fermer la modale au clic
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal); // Ajoute un écouteur d'événement pour fermer la modale via le bouton de fermeture
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation); // Empêche la propagation de l'événement de clic

    // Affiche la vue de la galerie par défaut
    document.getElementById('view-gallery').classList.add('active'); 
    document.getElementById('view-add-photo').classList.remove('active');
    console.log("Modale ouverte");
};

const closeModal = function (e) {
    if (modal === null) return; // Si aucune modale n'est ouverte, ne fait rien
    e.preventDefault(); // Empêche le comportement par défaut
    console.log("Fermeture de la modale");

    modal.style.display = "none"; // Cache la modale
    modal.setAttribute('aria-hidden', 'true'); // Rend la modale invisible pour les lecteurs d'écran
    modal.removeAttribute('aria-modal'); // Retire l'attribut aria-modal
    modal.removeEventListener('click', closeModal); // Retire l'écouteur d'événement pour fermer la modale
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal); // Retire l'écouteur d'événement du bouton de fermeture
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation); // Retire l'écouteur d'événement qui empêche la propagation
    modal = null; // Réinitialise la variable modale
    console.log("Modale fermée");
};

const stopPropagation = function (e) {
    e.stopPropagation(); // Empêche la propagation de l'événement de clic
};

const openAddPhotoView = function (e) {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    document.getElementById('view-gallery').classList.remove('active'); // Désactive la vue de la galerie
    document.getElementById('view-add-photo').classList.add('active'); // Active la vue pour ajouter une photo
};

document.querySelector('.js-modal-trigger').addEventListener('click', openModal); // Ajoute un écouteur d'événement pour ouvrir la modale
document.getElementById('open-add-photo').addEventListener('click', openAddPhotoView); // Ajoute un écouteur d'événement pour ouvrir la vue "ajouter une photo"

console.log("Écouteur d'événements ajouté au lien de déclenchement de la modale"); // Message de confirmation dans la console


// Sélectionner le conteneur de la galerie où les images seront affichées
const photoGallery = document.querySelector(".modal-gallery");

// Fonction asynchrone pour afficher les images de la galerie
async function displayGalleryModal() {
    // Vider le conteneur de la galerie avant d'ajouter de nouvelles images
    photoGallery.innerHTML = "";

    // Récupérer les projets depuis l'API
    const projects = await collectProjects();

    // Parcourir chaque projet récupéré
    projects.forEach(project => {
        // Créer des éléments HTML pour chaque projet
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const trash = document.createElement("i");

        // Ajouter des classes et des attributs aux éléments créés
        trash.classList.add("fa-solid", "fa-trash-can"); // Ajouter des classes pour l'icône poubelle
        trash.dataset.id = project.id; // Stocker l'ID du projet dans l'élément poubelle
        img.src = project.imageUrl; // Définir l'URL de l'image

        // Ajouter les éléments enfants à leurs parents respectifs
        span.appendChild(trash); // Ajouter l'icône poubelle dans le span
        figure.appendChild(span); // Ajouter le span dans la figure
        figure.appendChild(img); // Ajouter l'image dans la figure

        // Ajouter la figure complète dans le conteneur de la galerie
        photoGallery.appendChild(figure);
    });

    // Ajouter la fonctionnalité de suppression d'images
    deleteProject();
}

//****** Étape 3.2 : Suppression de travaux existants

// Fonction pour ajouter la fonctionnalité de suppression d'images
function deleteProject() {
    // Sélectionner toutes les icônes poubelles
    const allTrashIcons = document.querySelectorAll(".fa-trash-can");
    // Récupérer le jeton d'authentification depuis le stockage local
    const token = localStorage.getItem('authToken');

     // Parcourir chaque icône poubelle
    allTrashIcons.forEach(trashIcon => {
        // Ajouter un écouteur d'événements pour le clic sur l'icône poubelle
        trashIcon.addEventListener("click", async (e) => {
            // Récupérer l'ID du projet à supprimer
            const projectId = trashIcon.dataset.id;
            try {
                // Envoyer une requête DELETE à l'API pour supprimer le projet
                const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Ajouter le jeton d'authentification
                    }
                });
                // Vérifier si la suppression a réussi
                if (!response.ok) {
                    // Si la suppression a échoué, afficher un message dans la console
                    console.log("Le delete n'a pas réussi !");
                    return;
                }
                // Si la suppression a réussi, afficher un message dans la console
                console.log("Le delete a réussi");
                // Réafficher la galerie après la suppression du projet
                displayGalleryModal();
            } catch (error) {
                // Afficher l'erreur dans la console s'il y a un problème
                console.error("Erreur lors de la suppression :", error);
            }
        });
    });
}

// Appeler la fonction pour afficher la galerie lors du chargement de la page
displayGalleryModal();

