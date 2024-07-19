/****** Etape 1.1 : Récupération des travaux depuis le back-end *******/

// Sélectionne l'élément div avec la classe .gallery et le stocke dans la variable divGallery
const divGallery = document.querySelector(".gallery");

// Variable globale pour stocker les projets récupérés
let allProjects = [];

// Fonction asynchrone pour récupérer les projets depuis l'API
async function collectProjects() {
    //console.log("collectProjects called"); //
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
        //console.log("Projects fetched:", dataProjects);
        allProjects = dataProjects; // Stocke les projets dans la variable globale
        displayProjects(allProjects); // Affiche les projets dans la galerie
        return allProjects; // Retourne les projets récupérés pour un usage ultérieur
    } catch (error) {
        console.log(error); // Affiche l'erreur dans la console s'il y a un problème
        return [];
    }
}

// Fonction pour afficher les projets dans le DOM (page HTML)
function displayProjects(projects) {
    if (!divGallery) {
        console.error("L'élément divGallery n'a pas été trouvé."); // Vérifie si l'élément divGallery existe
        return;
    }
    divGallery.innerHTML = ""; // Vide la galerie avant d'afficher les projets
    if (projects && projects.length > 0) {
        // Parcourt chaque projet et l'ajoute à la galerie
        projects.forEach(project => {
            const figure = document.createElement("figure"); // Crée un nouvel élément figure pour chaque projet           
            const img = document.createElement("img"); // Crée un élément img pour l'image du projet
            const figCaption = document.createElement("figcaption"); // Crée un élément figcaption pour le titre du projet

            // Définit les attributs de l'image du projet
            img.src = project.imageUrl;
            img.alt = project.title;

            figCaption.textContent = project.title; // Définit le texte de la légende avec le titre du projet

            figure.id = project.id; // Définit l'ID de la figure avec l'ID du projet

            // Déclare l'image et la légende comme enfant de la figure
            figure.appendChild(img);
            figure.appendChild(figCaption);

            divGallery.appendChild(figure); // Déclare la figure comme enfant de divGallery
        });
    } else {
        console.log("Aucun projet à afficher"); // Message de console si aucun projet n'est trouvé
    }
}

//****** Étape 1.2 : Réalisation du filtre des travaux ******/

// Sélectionne l'élément div avec la classe .filters et le stocke dans la variable divFilters
const divFilters = document.querySelector(".filters");

// Fonction asynchrone pour récupérer les catégories depuis l'API
async function collectCategories() {
    //console.log("collectCategories called");
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
        //console.log("Categories fetched:", dataCategories); 
        return dataCategories;// Retourne les catégories récupérées pour un usage ultérieur
    } catch (error) {
        console.log(error); // Affiche l'erreur dans la console s'il y a un problème
        return [];
    }
}

// Fonction pour afficher les catégories dans le DOM (page HTML)
function displayCategories(categories) {
    if (!divFilters) {
        // Vérifie si l'élément divFilters existe
        console.error("L'élément divFilters n'a pas été trouvé.");
        return;
    }
    divFilters.innerHTML = ""; // Vide le conteneur de filtres avant d'ajouter les catégories
    const btnAll = document.createElement("button"); // Crée et ajoute un bouton pour afficher tous les projets
    btnAll.textContent = "Tous"; // Texte du bouton
    btnAll.id = "0"; // ID du bouton pour tous les projets
    btnAll.classList.add("filter-btn"); // Ajouter une classe pour le bouton
    divFilters.appendChild(btnAll); //Déclare btnAll comme enfant de divFilters

    // Vérifie s'il y a des catégories à afficher
    if (categories && categories.length > 0) {
        // Parcourt chaque catégorie et crée un bouton pour chacune
        categories.forEach(category => {
            const btnCategory = document.createElement("button");
            btnCategory.textContent = category.name; // Texte du bouton avec le nom de la catégorie
            btnCategory.id = category.id; // ID du bouton avec l'ID de la catégorie
            btnCategory.classList.add("filter-btn"); // Classe commune pour tous les boutons
            divFilters.appendChild(btnCategory); // Ajoute le bouton au conteneur de filtres
        });
        //console.log("Catégories ajoutées au DOM");
    } else {
        console.log("Aucune catégorie à afficher"); // Message de console si aucune catégorie n'est trouvée
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
            allButtons.forEach(btn => btn.classList.remove('active')); // Supprimer la classe active de tous les boutons
            e.target.classList.add('active'); // Ajouter la classe active au bouton cliqué
            if (divGallery) {
                divGallery.innerHTML = ""; // Vide la galerie avant d'afficher les projets filtrés
                if (buttonsId !== "0") {
                    // Filtre les projets selon l'ID de la catégorie
                    const galleryFilter = allProjects.filter(project => project.categoryId == buttonsId);
                    // Affiche les projets filtrés
                    if (galleryFilter.length > 0) {
                        displayProjects(galleryFilter);
                    } else {
                        console.log("Aucun projet trouvé pour cette catégorie");
                    }
                } else {
                    // Si l'ID du bouton est "0", affiche tous les projets
                    displayProjects(allProjects);
                }
            } else {
                console.error("L'élément divGallery n'a pas été trouvé.");
            }
        });
    });
    //console.log("Filter buttons initialized:", allButtons);
}

// Appeler collectProjects et collectCategories une seule fois au chargement de la page d'accueil
if (window.location.pathname.endsWith("index.html")) {
    //console.log("Page d'accueil détectée"); //
    collectProjects(); // Récupère les travaux depuis l'API
    collectCategories().then(categories => displayCategories(categories)); // Récupère les catégories et les affiche
}

//****** Étape 3.1 : Ajout de la fenêtre modale

// Variable pour stocker la référence de la modale ouverte
let modal = null;

const openModal = function (e) {
    e.preventDefault(); // Empêche le comportement par défaut du lien (navigation)

    //console.log("Ouverture de la modale");

    // Trouve l'élément cible de la modale en utilisant l'attribut href du lien cliqué
    const target = document.querySelector(e.currentTarget.getAttribute('href'));
    if (!target) { // Vérifie si l'élément cible de la modale existe
        console.error("Modale non trouvée"); // Affiche un message d'erreur si la modale n'est pas trouvée
        return; // Arrête l'exécution de la fonction
    }

    target.style.display = null; // Affiche la modale en réinitialisant le style display (le rendant visible)
    target.removeAttribute('aria-hidden'); // Rend la modale visible pour les lecteurs d'écran
    target.setAttribute('aria-modal', 'true'); // Indique que c'est une modale pour les lecteurs d'écran
    modal = target; // Stocke la référence de la modale dans la variable modal

    modal.addEventListener('click', closeModal); // Ajoute un écouteur d'événement pour fermer la modale lorsque l'on clique en dehors
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal); // Ajoute un écouteur d'événement pour fermer la modale via le bouton de fermeture
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation); // Empêche la propagation de l'événement de clic pour que les clics dans la modale ne ferment pas celle-ci

    document.getElementById('view-gallery').classList.add('active'); // Affiche la vue de la galerie par défaut
    document.getElementById('view-add-photo').classList.remove('active'); // Désactive la vue pour ajouter une photo

    //console.log("Modale ouverte");
};

const closeModal = function (e) {
    if (modal === null) return; // Si aucune modale n'est ouverte, ne fait rien

    e.preventDefault(); // Empêche le comportement par défaut de l'événement

    //console.log("Fermeture de la modale");

    modal.style.display = "none"; // Cache la modale en modifiant son style display
    modal.setAttribute('aria-hidden', 'true'); // Rend la modale invisible pour les lecteurs d'écran
    modal.removeAttribute('aria-modal'); // Retire l'attribut aria-modal
    modal.removeEventListener('click', closeModal); // Retire l'écouteur d'événement pour fermer la modale
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal); // Retire l'écouteur d'événement du bouton de fermeture
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation); // Retire l'écouteur d'événement qui empêche la propagation
    modal = null; // Réinitialise la variable modal

    //console.log("Modale fermée");
};

const stopPropagation = function (e) {
    e.stopPropagation(); // Empêche la propagation de l'événement de clic pour éviter de fermer la modale lorsqu'on clique à l'intérieur
};

const openAddPhotoView = function (e) {
    e.preventDefault(); // Empêche le comportement par défaut du lien (navigation)

    document.getElementById('view-gallery').classList.remove('active'); // Désactive la vue de la galerie
    document.getElementById('view-add-photo').classList.add('active'); // Active la vue pour ajouter une photo
};

// Nouvelle fonction pour initialiser les modales
function initializeModals() {
    const modalTrigger = document.querySelector('.js-modal-trigger'); // Sélectionne le déclencheur de la modale (lien ou bouton)
    const addPhotoButton = document.getElementById('open-add-photo'); // Sélectionne le bouton pour ouvrir la modale d'ajout de photo

    if (modalTrigger) {
        // Ajoute un écouteur d'événement pour ouvrir la modale
        modalTrigger.addEventListener('click', openModal);
    } else {
        console.error("L'élément .js-modal-trigger n'a pas été trouvé."); // Affiche un message d'erreur si le déclencheur n'est pas trouvé
    }

    if (addPhotoButton) {
        // Ajoute un écouteur d'événement pour ouvrir la vue d'ajout de photo
        addPhotoButton.addEventListener('click', openAddPhotoView);
    } else {
        console.error("L'élément #open-add-photo n'a pas été trouvé."); // Affiche un message d'erreur si le bouton n'est pas trouvé
    }

    //console.log("Écouteur d'événements ajouté au lien de déclenchement de la modale"); //
}

// Appeler initializeModals seulement sur la page homepage-edit.html
if (window.location.pathname.includes('homepage-edit.html')) {
    initializeModals(); // Appel de la fonction pour initialiser les modales
}

// Sélectionne l'élément de la galerie de la modale
const photoGallery = document.querySelector(".modal-gallery");

// Fonction asynchrone pour afficher les images de la galerie dans la modale
async function displayGalleryModal() {
    if (!photoGallery) {
        console.error("L'élément photoGallery n'a pas été trouvé."); // Affiche un message d'erreur si l'élément photoGallery n'est pas trouvé
        return; // Arrête l'exécution de la fonction
    }

    photoGallery.innerHTML = ""; // Vide le contenu de la galerie avant d'ajouter les nouvelles images

    const projects = await collectProjects(); // Récupère les projets via la fonction collectProjects

    projects.forEach(project => {
        const figure = document.createElement("figure"); // Crée un élément figure pour chaque projet
        const img = document.createElement("img"); // Crée un élément img pour l'image du projet
        const span = document.createElement("span"); // Crée un élément span pour contenir l'icône de suppression
        const trash = document.createElement("i"); // Crée un élément i pour l'icône de suppression

        // Ajoute les classes nécessaires pour l'icône de suppression
        trash.classList.add("fa-solid", "fa-trash-can");
        trash.dataset.id = project.id; // Stocke l'ID du projet dans l'élément trash
        img.src = project.imageUrl; // Définit l'URL de l'image
        img.alt = project.title; // Définit le texte alternatif de l'image

        span.appendChild(trash); // Ajoute l'icône de suppression au span
        // Ajoute le span et l'image à la figure
        figure.appendChild(span);
        figure.appendChild(img);

        photoGallery.appendChild(figure); // Ajoute la figure à la galerie
    });

    deleteProject(); // Ajoute la fonctionnalité de suppression d'images
}

//****** Étape 3.2 : Suppression de travaux existants ******/

// Fonction pour vérifier l'existence du token d'authentification
function checkToken() {
    // Récupère le token d'authentification depuis le stockage local
    const token = window.localStorage.getItem("authToken");
    if (!token) { // Vérifie si le token n'existe pas
        console.log("Token non trouvé. Veuillez vous connecter."); // Affiche un message dans la console si le token n'est pas trouvé
    }
    return token; // Retourne le token (ou null si non trouvé)
}

// Fonction asynchrone pour supprimer un projet
async function deleteProject() {
    const allTrashIcons = document.querySelectorAll(".fa-trash-can"); // Sélectionne toutes les icônes de suppression (poubelle) dans la galerie
    const token = window.localStorage.getItem("authToken"); // Récupère le token d'authentification depuis le stockage local

    if (!token) { // Vérifie si le token n'existe pas
        console.log("Impossible de procéder sans jeton d'authentification."); // Affiche un message dans la console si le token n'est pas trouvé
        return; // Arrête l'exécution de la fonction
    }

    // Ajoute un écouteur d'événement de clic à chaque icône de suppression
    allTrashIcons.forEach(trashIcon => {
        trashIcon.addEventListener("click", async (e) => {
            const projectId = trashIcon.dataset.id; // Récupère l'ID du projet à partir de l'attribut data-id de l'icône cliquée
            try {
                // Envoie une requête DELETE à l'API pour supprimer le projet
                const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                    method: 'DELETE', // Méthode HTTP DELETE pour supprimer le projet
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Ajoute le token d'authentification dans l'en-tête
                    }
                });
                if (!response.ok) { // Vérifie si la suppression a échoué
                    console.log("Le delete n'a pas réussi !"); // Affiche un message dans la console si la suppression a échoué
                    return; // Arrête l'exécution de la fonction
                }
                //console.log("Le delete a réussi");
                displayGalleryModal(); // Met à jour l'affichage de la galerie en appelant la fonction displayGalleryModal
            } catch (error) { // Capture et affiche les erreurs éventuelles
                console.log(error); // Affiche l'erreur dans la console
            }
        });
    });
}

// Appeler la fonction pour afficher la galerie lors du chargement de la page
if (window.location.pathname.includes('homepage-edit.html')) {
    displayGalleryModal(); // Affiche la galerie en appelant la fonction displayGalleryModal
}

/****** Étape 3.3 : Envoi d’un nouveau projet au back-end via le formulaire de la modale ******/

// Sélectionne les éléments pour les différentes vues et les icônes de navigation dans la modale
const viewGallery = document.getElementById("view-gallery"); // Vue de la galerie
const viewAddPhoto = document.getElementById("view-add-photo"); // Vue d'ajout de photo
const backArrow = document.querySelector(".js-back"); // Icône de retour en arrière
const closeModalIcon = document.querySelector(".js-modal-close"); // Icône de fermeture de la modale

// Gère l'événement de clic sur l'icône de retour en arrière
if (backArrow) {
    backArrow.addEventListener("click", function() {
        if (viewAddPhoto && viewGallery) {
            // Affiche la vue de la galerie et cache la vue d'ajout de photo
            viewAddPhoto.classList.remove('active');
            viewGallery.classList.add('active');
            // Réinitialise l'aperçu de l'image
            if (addImage && labelPreview && iconPreview && textPreview && inputPreview && removeImageIcon) {
                addImage.src = ""; // Réinitialise la source de l'image
                addImage.style.display = "none"; // Cache l'élément image
                labelPreview.style.display = "flex"; // Affiche le label de prévisualisation
                iconPreview.style.display = "flex"; // Affiche l'icône de prévisualisation
                textPreview.style.display = "flex"; // Affiche le texte de prévisualisation
                inputPreview.value = ""; // Réinitialise le champ de fichier
                removeImageIcon.style.display = "none"; // Cache le bouton "Supprimer l'image"
            }
        } else {
            console.error("L'un des éléments viewAddPhoto ou viewGallery n'a pas été trouvé.");
        }
    });
}

// Gère l'événement de clic sur l'icône de fermeture de la modale
if (closeModalIcon) {
    closeModalIcon.addEventListener("click", function() {
        if (modal) {
            modal.style.display = "none"; // Cache la modale
            modal.setAttribute('aria-hidden', 'true'); // Rend la modale invisible pour les lecteurs d'écran
            modal.removeAttribute('aria-modal'); // Retire l'attribut aria-modal
            modal.removeEventListener('click', closeModal); // Retire l'écouteur d'événement pour fermer la modale
            modal.querySelector('.js-modal-close').removeEventListener('click', closeModal); // Retire l'écouteur d'événement du bouton de fermeture
            modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation); // Retire l'écouteur d'événement qui empêche la propagation
            modal = null; // Réinitialise la variable modal
            console.log("Modale fermée");
        }
    });
}

// Sélectionne les éléments pour l'aperçu de l'image et les boutons de contrôle
const addImage = document.querySelector(".upload-div img"); // Élément image pour l'aperçu
const inputPreview = document.querySelector(".upload-div input"); // Champ de fichier pour l'upload
const labelPreview = document.querySelector(".upload-label"); // Label de prévisualisation
const iconPreview = document.querySelector(".upload-div .fa-image"); // Icône de prévisualisation
const textPreview = document.querySelector(".upload-div p"); // Texte de prévisualisation
const removeImageIcon = document.querySelector(".remove-image-icon"); // Bouton "Supprimer l'image"

// Gère l'événement de changement de fichier dans le champ de fichier
if (inputPreview) {
    inputPreview.addEventListener("change", () => {
        const file = inputPreview.files[0]; // Récupère le fichier sélectionné
        if (file) {
            const reader = new FileReader(); // Crée un lecteur de fichier
            reader.onload = function(e) {
                if (addImage && labelPreview && iconPreview && textPreview) {
                    addImage.src = e.target.result; // Affiche l'aperçu de l'image
                    addImage.style.display = "flex"; // Affiche l'élément image
                    labelPreview.style.display = "none"; // Cache le label de prévisualisation
                    iconPreview.style.display = "none"; // Cache l'icône de prévisualisation
                    textPreview.style.display = "none"; // Cache le texte de prévisualisation
                    removeImageIcon.style.display = "flex"; // Affiche le bouton "Supprimer l'image"
                } else {
                    console.error("L'un des éléments pour l'aperçu de l'image n'a pas été trouvé.");
                }
            }
            reader.readAsDataURL(file); // Lit le fichier comme URL de données
        }
    });
}

// Gère l'événement de clic sur le bouton "Supprimer l'image"
if (removeImageIcon) {
    removeImageIcon.addEventListener("click", () => {
        if (addImage && labelPreview && iconPreview && textPreview && inputPreview && removeImageIcon) {
            addImage.src = ""; // Réinitialise la source de l'image
            addImage.style.display = "none"; // Cache l'élément image
            labelPreview.style.display = "flex"; // Affiche le label de prévisualisation
            iconPreview.style.display = "flex"; // Affiche l'icône de prévisualisation
            textPreview.style.display = "flex"; // Affiche le texte de prévisualisation
            inputPreview.value = ""; // Réinitialise le champ de fichier
            removeImageIcon.style.display = "none"; // Cache le bouton "Supprimer l'image"
        } else {
            console.error("L'un des éléments pour réinitialiser l'aperçu de l'image n'a pas été trouvé.");
        }
    });
}

// Sélectionne les éléments du formulaire et le bouton "Valider"
const projectForm = document.querySelector(".modal-view form"); // Formulaire d'ajout de projet
const titleInput = document.querySelector(".uploadForm-div #title"); // Champ de titre
const categoryInput = document.querySelector(".uploadForm-div #category"); // Champ de catégorie
const imageInput = document.querySelector(".upload-div input"); // Champ de fichier pour l'image
const submitButton = document.querySelector(".submit-btn"); // Bouton "Valider"

// Fonction pour vérifier si tous les champs du formulaire sont remplis
function checkFormFields() {
    if (titleInput.value && categoryInput.value && imageInput.files.length > 0) {
        submitButton.classList.add('active'); // Active le bouton "Valider"
        submitButton.disabled = false; // Active le bouton "Valider"
    } else {
        submitButton.classList.remove('active'); // Désactive le bouton "Valider"
        submitButton.disabled = true; // Désactive le bouton "Valider"
    }
}

// Ajoute des écouteurs d'événements pour vérifier les champs du formulaire à chaque changement
titleInput.addEventListener('input', checkFormFields); // Lorsque l'utilisateur saisit du texte dans le champ titre, vérifie les champs du formulaire
categoryInput.addEventListener('change', checkFormFields); // Lorsque l'utilisateur sélectionne une catégorie, vérifie les champs du formulaire
imageInput.addEventListener('change', checkFormFields); // Lorsque l'utilisateur sélectionne une image, vérifie les champs du formulaire

// Appelle la fonction checkFormFields pour s'assurer que le bouton "Valider" est correctement configuré au chargement
checkFormFields(); // Vérifie l'état des champs du formulaire au chargement de la page

// Fonction asynchrone pour récupérer les catégories depuis l'API
async function collectCategories() {
    //console.log("collectCategories called for modal");
    try {
        // Envoie une requête GET à l'API pour obtenir les catégories
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) { // Vérifie si la réponse n'est pas correcte (code HTTP 200-299)
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`); // Si la réponse est incorrecte, lance une erreur avec le statut HTTP
        }
        const dataCategories = await response.json(); // Convertit la réponse en format JSON
        return dataCategories; // Retourne les catégories récupérées
    } catch (error) { // En cas d'erreur lors de la requête
        console.log(error); // Affiche l'erreur dans la console
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

// Fonction asynchrone pour afficher les catégories dans le formulaire de la modale
async function displayCategoriesModal() {
    const select = document.querySelector(".uploadForm-div select"); // Sélectionne le champ select du formulaire
    const categories = await collectCategories(); // Récupère les catégories via la fonction collectCategories
    if (select) { // Vérifie si l'élément select existe
        categories.forEach(category => { // Parcourt chaque catégorie récupérée
            const option = document.createElement("option"); // Crée un nouvel élément option
            option.value = category.id; // Définit la valeur de l'option avec l'ID de la catégorie
            option.textContent = category.name; // Définit le texte de l'option avec le nom de la catégorie
            select.appendChild(option); // Ajoute l'option au champ select
        });
    } else { // Si l'élément select n'est pas trouvé
        console.error("L'élément select n'a pas été trouvé."); // Affiche un message d'erreur dans la console
    }
}

// Affiche les catégories dans le formulaire si on est sur la page homepage-edit.html
if (window.location.pathname.includes('homepage-edit.html')) {
    displayCategoriesModal(); // Appelle la fonction pour afficher les catégories dans la modale
}

// Sélectionne les éléments du formulaire pour l'ajout de projet
const projectAddForm = document.querySelector(".modal-view form"); // Sélectionne le formulaire d'ajout de projet
const title = document.querySelector(".uploadForm-div #title"); // Sélectionne le champ de titre
const category = document.querySelector(".uploadForm-div #category"); // Sélectionne le champ de catégorie
const inputFile = document.querySelector(".upload-div input"); // Sélectionne le champ de fichier pour l'image

// Crée un élément pour afficher les messages de statut
const statutMessage = document.createElement("p"); // Crée un nouvel élément paragraphe pour afficher les messages de statut
if (projectAddForm) { // Vérifie si le formulaire d'ajout de projet existe
    projectAddForm.appendChild(statutMessage); // Ajoute l'élément paragraphe au formulaire
}

// Gère la soumission du formulaire d'ajout de projet
if (projectAddForm) {
    projectAddForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)

        // Vérifie que tous les champs sont remplis
        if (!title.value || !category.value || !inputFile.value) {
            statutMessage.textContent = "Veuillez remplir tous les champs et ajouter une photo."; // Définit le message de statut
            statutMessage.style.color = 'red'; // Change la couleur du texte du message de statut en rouge
            return; // Arrête l'exécution de la fonction si un champ est vide
        }

        // Crée un objet FormData pour envoyer les données du formulaire
        const formData = new FormData();
        formData.append('title', title.value); // Ajoute le titre au FormData
        formData.append('category', category.value); // Ajoute la catégorie au FormData
        formData.append('image', inputFile.files[0]); // Ajoute le fichier image au FormData

        // Récupère le token d'authentification depuis le stockage local
        const token = window.localStorage.getItem('authToken');
        if (!token) { // Vérifie si le token n'existe pas
            statutMessage.textContent = "Vous devez être connecté pour ajouter un projet."; // Définit le message de statut
            statutMessage.style.color = 'red'; // Change la couleur du texte du message de statut en rouge
            return; // Arrête l'exécution de la fonction si le token n'est pas trouvé
        }

        try {
            // Envoie une requête POST à l'API pour ajouter un nouveau projet
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST", // Méthode de requête POST pour envoyer les données
                body: formData, // Utilise FormData comme corps de la requête
                headers: {
                    "Authorization": `Bearer ${token}` // Ajoute le token d'authentification dans les en-têtes
                }
            });

            if (!response.ok) { // Vérifie si la réponse n'est pas correcte (code HTTP 200-299)
                throw new Error("Erreur lors de l'envoi du formulaire"); // Lance une erreur si la réponse est incorrecte
            }

            const data = await response.json(); // Convertit la réponse en JSON
            projectAddForm.reset(); // Réinitialise le formulaire après succès
            statutMessage.textContent = "Projet ajouté avec succès !"; // Définit le message de confirmation
            statutMessage.style.color = 'green'; // Change la couleur du texte du message de confirmation en vert
            collectProjects(); // Met à jour l'affichage des projets
            displayGalleryModal(); // Met à jour l'affichage de la galerie
        } catch (error) { // En cas d'erreur lors de la requête
            statutMessage.textContent = "Erreur lors de l'envoi du formulaire. Veuillez réessayer."; // Définit le message d'erreur
            statutMessage.style.color = 'red'; // Change la couleur du texte du message d'erreur en rouge
        }
    });
}

// Récupère les projets et les catégories au chargement de la page d'accueil
if (window.location.pathname.endsWith("index.html")) {
    collectProjects(); // Récupère les projets
    collectCategories().then(categories => displayCategories(categories)); // Récupère les catégories et les affiche
}