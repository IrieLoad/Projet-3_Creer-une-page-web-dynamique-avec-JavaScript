//récupération des projets depuis le fichier JSON
const reponse = await fetch('projets.json');
const design = await reponse.json();

for (let i=0; i < design.lenght; i++) {

    const creation = design[i];

    //rattachement des balises au DOM
    const divGallery = document.querySelector(".gallery");

    //creation d'une balise dédiée à un projet
    const designElement = document.createElement("concept")

    //création du contenu (=les balises) de chaque projet
    const imageCreation = document.createElement("img");
    imageCreation.src = creation.image;

    const nomCreation = document.createElement("h2");
    nomCreation.innerText = creation.nom;

    //rattachement de la balise concept à la divGallery
    divGallery.appendChild(designElement);

    //rattachement à designElement (= la balise concept)
    designElement.appendChild(imageCreation);
    designElement.appendChild(nomCreation);

}

const boutonFiltrer = document.querySelector(".btn-filter");

boutonFiltrer.addEventListener("click", function () {
    const objetsFiltres = objets.filtrer(function (design) {
        return design.categorie === objets;
    });
});
