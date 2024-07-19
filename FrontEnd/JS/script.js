//******Étape 1.1 : Récupération des travaux depuis le back-end

// Sélectionne l'élément div avec la classe .gallery et le stocke dans la variable divGallery
const divGallery = document.querySelector(".gallery");

// Variable globale pour stocker les projets récupérés
let allProjects = [];

// Fonction asynchrone pour récupérer les projets depuis l'API
async function collectProjects() {
    console.log("collectProjects called"); // Affiche un message dans la console pour indiquer que la fonction a été appelée
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
        console.log("Projects fetched:", dataProjects); // Affiche les projets récupérés dans la console
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
    if (!divGallery) {
        // Vérifie si l'élément divGallery existe
        console.error("L'élément divGallery n'a pas été trouvé.");
        return;
    }
    // Vide la galerie avant d'afficher les projets
    divGallery.innerHTML = "";
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
        console.log("Aucun projet à afficher"); // Message de console si aucun projet n'est trouvé
    }
}

//****** Étape 1.2 : Réalisation du filtre des travaux

// Sélectionne l'élément div avec la classe .filters et le stocke dans la variable divFilters
const divFilters = document.querySelector(".filters");

// Fonction asynchrone pour récupérer les catégories depuis l'API
async function collectCategories() {
    console.log("collectCategories called"); // Affiche un message dans la console pour indiquer que la fonction a été appelée
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
        console.log("Categories fetched:", dataCategories); // Affiche les catégories récupérées dans la console
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
    if (!divFilters) {
        // Vérifie si l'élément divFilters existe
        console.error("L'élément divFilters n'a pas été trouvé.");
        return;
    }
    // Vide le conteneur de filtres avant d'ajouter les catégories
    divFilters.innerHTML = "";
    // Crée et ajoute un bouton pour afficher tous les projets
    const btnAll = document.createElement("button");
    btnAll.textContent = "Tous"; // Texte du bouton
    btnAll.id = "0"; // ID du bouton pour tous les projets
    btnAll.classList.add("filter-btn"); // Ajouter une classe pour le bouton
    divFilters.appendChild(btnAll);

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
        console.log("Catégories ajoutées au DOM");
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
            // Supprimer la classe active de tous les boutons
            allButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            e.target.classList.add('active');
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
    console.log("Filter buttons initialized:", allButtons);
}

// Appeler collectProjects et collectCategories une seule fois au chargement de la page d'accueil
if (window.location.pathname.endsWith("index.html")) {
    console.log("Page d'accueil détectée"); // Message de console pour indiquer que la page d'accueil est chargée
    collectProjects(); // Récupère les travaux depuis l'API
    collectCategories().then(categories => displayCategories(categories)); // Récupère les catégories et les affiche
}

//****** Étape 3.1 : Ajout de la fenêtre modale

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

// Nouvelle fonction pour initialiser les modales
function initializeModals() {
    const modalTrigger = document.querySelector('.js-modal-trigger');
    const addPhotoButton = document.getElementById('open-add-photo');

    if (modalTrigger) {
        modalTrigger.addEventListener('click', openModal);
    } else {
        console.error("L'élément .js-modal-trigger n'a pas été trouvé.");
    }

    if (addPhotoButton) {
        addPhotoButton.addEventListener('click', openAddPhotoView);
    } else {
        console.error("L'élément #open-add-photo n'a pas été trouvé.");
    }

    console.log("Écouteur d'événements ajouté au lien de déclenchement de la modale");
}

// Appeler initializeModals seulement sur la page homepage-edit.html
if (window.location.pathname.includes('homepage-edit.html')) {
    initializeModals(); // Appel de la fonction pour initialiser les modales
}

const photoGallery = document.querySelector(".modal-gallery");

// Fonction asynchrone pour afficher les images de la galerie
async function displayGalleryModal() {
    if (!photoGallery) {
        console.error("L'élément photoGallery n'a pas été trouvé.");
        return;
    }
    photoGallery.innerHTML = "";

    const projects = await collectProjects();

    projects.forEach(project => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const trash = document.createElement("i");

        trash.classList.add("fa-solid", "fa-trash-can");
        trash.dataset.id = project.id;
        img.src = project.imageUrl;
        img.alt = project.title;

        span.appendChild(trash);
        figure.appendChild(span);
        figure.appendChild(img);
        photoGallery.appendChild(figure);
    });

    deleteProject();
}

//****** Étape 3.2 : Suppression de travaux existants

function checkToken() {
    const token = window.localStorage.getItem("authToken");
    if (!token) {
        console.log("Token non trouvé. Veuillez vous connecter.");
    }
    return token;
}

async function deleteProject() {
    const allTrashIcons = document.querySelectorAll(".fa-trash-can");
    const token = window.localStorage.getItem("authToken");

    if (!token) {
        console.log("Impossible de procéder sans jeton d'authentification.");
        return;
    }

    allTrashIcons.forEach(trashIcon => {
        trashIcon.addEventListener("click", async (e) => {
            const projectId = trashIcon.dataset.id;
            try {
                const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    console.log("Le delete n'a pas réussi !");
                    return;
                }
                console.log("Le delete a réussi");
                displayGalleryModal();
            } catch (error) {
                console.log(error);
            }
        });
    });
}
// Appeler la fonction pour afficher la galerie lors du chargement de la page
if (window.location.pathname.includes('homepage-edit.html')) {
    displayGalleryModal();
}

/****** Étape 3.3 : Envoi d’un nouveau projet au back-end via le formulaire de la modale ******/

const viewGallery = document.getElementById("view-gallery");
const viewAddPhoto = document.getElementById("view-add-photo");
const backArrow = document.querySelector(".js-back");
const closeModalIcon = document.querySelector(".js-modal-close");

if (backArrow) {
    backArrow.addEventListener("click", function() {
        if (viewAddPhoto && viewGallery) {
            viewAddPhoto.classList.remove('active');
            viewGallery.classList.add('active');
            // Réinitialiser l'aperçu de l'image
            if (addImage && labelPreview && iconPreview && textPreview && inputPreview && removeImageBtn) {
                addImage.src = "";
                addImage.style.display = "none";
                labelPreview.style.display = "flex";
                iconPreview.style.display = "flex";
                textPreview.style.display = "flex";
                inputPreview.value = ""; // Réinitialiser le champ de fichier
                removeImageIcon.style.display = "none"; // Cacher le bouton "Supprimer l'image"
            }
        } else {
            console.error("L'un des éléments viewAddPhoto ou viewGallery n'a pas été trouvé.");
        }
    });
}

if (closeModalIcon) {
    closeModalIcon.addEventListener("click", function() {
        if (modal) {
            modal.style.display = "none";
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
            modal.removeEventListener('click', closeModal);
            modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
            modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
            modal = null;
            console.log("Modale fermée");
        }
    });
}

const addImage = document.querySelector(".upload-div img");
const inputPreview = document.querySelector(".upload-div input");
const labelPreview = document.querySelector(".upload-label");
const iconPreview = document.querySelector(".upload-div .fa-image");
const textPreview = document.querySelector(".upload-div p");
const removeImageIcon = document.querySelector(".remove-image-icon");

if (inputPreview) {
    inputPreview.addEventListener("change", () => {
        const file = inputPreview.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (addImage && labelPreview && iconPreview && textPreview) {
                    addImage.src = e.target.result;
                    addImage.style.display = "flex";
                    labelPreview.style.display = "none";
                    iconPreview.style.display = "none";
                    textPreview.style.display = "none";
                    removeImageIcon.style.display = "flex"; // Afficher le bouton "Supprimer l'image"
                } else {
                    console.error("L'un des éléments pour l'aperçu de l'image n'a pas été trouvé.");
                }
            }
            reader.readAsDataURL(file);
        }
    });
}

if (removeImageIcon) {
    removeImageIcon.addEventListener("click", () => {
        if (addImage && labelPreview && iconPreview && textPreview && inputPreview && removeImageIcon) {
            addImage.src = "";
            addImage.style.display = "none";
            labelPreview.style.display = "flex";
            iconPreview.style.display = "flex";
            textPreview.style.display = "flex";
            inputPreview.value = ""; // Réinitialiser le champ de fichier
            removeImageIcon.style.display = "none"; // Cacher le bouton "Supprimer l'image"
        } else {
            console.error("L'un des éléments pour réinitialiser l'aperçu de l'image n'a pas été trouvé.");
        }
    });
}

// Sélectionner les éléments du formulaire et le bouton "Valider"
const projectForm = document.querySelector(".modal-view form");
const titleInput = document.querySelector(".uploadForm-div #title");
const categoryInput = document.querySelector(".uploadForm-div #category");
const imageInput = document.querySelector(".upload-div input");
const submitButton = document.querySelector(".submit-btn");

// Fonction pour vérifier si tous les champs du formulaire sont remplis
function checkFormFields() {
    if (titleInput.value && categoryInput.value && imageInput.files.length > 0) {
        submitButton.classList.add('active');
        submitButton.disabled = false;
    } else {
        submitButton.classList.remove('active');
        submitButton.disabled = true;
    }
}

// Ajouter des écouteurs d'événements pour vérifier les champs du formulaire à chaque changement
titleInput.addEventListener('input', checkFormFields);
categoryInput.addEventListener('change', checkFormFields);
imageInput.addEventListener('change', checkFormFields);

// Appeler checkFormFields pour s'assurer que le bouton "Valider" est correctement configuré au chargement
checkFormFields();

async function collectCategories() {
    console.log("collectCategories called for modal");
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        const dataCategories = await response.json();
        return dataCategories;
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function displayCategoriesModal() {
    const select = document.querySelector(".uploadForm-div select");
    const categories = await collectCategories();
    if (select) {
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    } else {
        console.error("L'élément select n'a pas été trouvé.");
    }
}

if (window.location.pathname.includes('homepage-edit.html')) {
    displayCategoriesModal();
}

const projectAddForm = document.querySelector(".modal-view form");
const title = document.querySelector(".uploadForm-div #title");
const category = document.querySelector(".uploadForm-div #category");
const inputFile = document.querySelector(".upload-div input");

const statutMessage = document.createElement("p");
if (projectAddForm) {
    projectAddForm.appendChild(statutMessage);
}

if (projectAddForm) {
    projectAddForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!title.value || !category.value || !inputFile.value) {
            statutMessage.textContent = "Veuillez remplir tous les champs et ajouter une photo.";
            statutMessage.style.color = 'red';
            return;
        }

        const formData = new FormData();
        formData.append('title', title.value);
        formData.append('category', category.value);
        formData.append('image', inputFile.files[0]);

        const token = window.localStorage.getItem('authToken');
        if (!token) {
            statutMessage.textContent = "Vous devez être connecté pour ajouter un projet.";
            statutMessage.style.color = 'red';
            return;
        }

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'envoi du formulaire");
            }

            const data = await response.json();
            projectAddForm.reset();
            statutMessage.textContent = "Projet ajouté avec succès !";
            statutMessage.style.color = 'green';
            collectProjects();
            displayGalleryModal();
        } catch (error) {
            statutMessage.textContent = "Erreur lors de l'envoi du formulaire. Veuillez réessayer.";
            statutMessage.style.color = 'red';
        }
    });
}

if (window.location.pathname.endsWith("index.html")) {
    collectProjects();
    collectCategories().then(categories => displayCategories(categories));
}