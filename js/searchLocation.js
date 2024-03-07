// Script pour faire la recherche de parcelle, coordonnee, ... 

// Source :
    // API3 + requete map.geo.admin.ch
    // https://twitter.github.io/typeahead.js/examples/
    
// Probleme : 
    // PBL : Peut pas mettre des virgules dans import // Format ecriture texte dans liste
    // PBL : Met numero parcelle puis commence a ecrire lettre commune il m affiche plus de liste deroulante -> on dirait aime pas les espaces



// Selection du champ de recherche
const searchInput = $('#searchInput');

// Recuperer ce que utilisateur a saisie dans la ligne recherche
function recoveryData() {
    // Récupérer la valeur du champ de recherche
    var query = searchInput.val();
    console.log("Data input search :", query);
    
    // Supprimer espace blanc inutile --> Inutile cette etape ? 
    var formattedQuery = query.trim()
    console.log("Data input search Format :", formattedQuery);

    return formattedQuery
}

// Construire l'URL de requete vers le serveur API map geo admin
function locationApiGeoadmin(text) {
    var url = 'https://api3.geo.admin.ch/rest/services/blw/SearchServer?sr=2056&searchText=' + text + '&lang=fr&type=locations';
    console.log("URL de la requête:", url);
    return url
}

// Envoyer la requête de l'URL
function fetchURL(url) {
    return fetch(url)
        .then(response => {
            if (response.ok) {
                // console.log("Requete URL send")
                return response.json(); // Si reponse est OK, retourner donnees JSON
            } else {
                throw new Error('Error lors de la requête');
            }
        });
}

// Recuperer les donner recu depuis URL 
function receiveData(data) {
    console.log('data ', data)

    if (data.results.length !== 0){
        // A un resultat dans results
        displaySearchResults(data.results);
    }
    else{
        // A pas de resultas dans results (eg on a fait une recherche par coordonnee)

        // Recuperer la valeur de recherche
        var text = recoveryData()
        var part = parseCoordinates(text)

        // Mettre a jour le marker / map
        updateMap(markerSource, part[0].trim(), part[1].trim())
    }
}

function parseCoordinates(text){
    // Supprimer les apostrophe s'il y en a 
    text = text.replace(/'/g, '');

    // separer en deux variable est et nord
    var part = text.split(',')
    return part
}

// Envoyer la requête de l'URL et recevoir les données
function fetchDataFromURL(url) {
    // Envoyer la requete
    fetchURL(url)
        // Recevoir data - reponse promise 
        .then(receiveData)
        .catch(error => {
            console.error('Error :', error);
        });
}


// Afficher les resultats de la recherche
function displaySearchResults(results) {
    // Convertir les resultats en un tableau               
    var suggestions = results.map(result => ({
        label: result.attrs.label,
        // label: stripHtmlTags(result.attrs.label),
        
        x: result.attrs.x, // Nord MN95
        y: result.attrs.y // Est MN95
    }));
    console.log("Objet select :", suggestions)

    // Appliquer l'autocomplete au champ de recherche
    searchInput.autocomplete({
        source: suggestions,
        select: function(event, ui) {
            // Element selectionner
            console.log("Resultat de la selection :", ui.item.label, ui.item.y , ui.item.x);

            // Mettre a jour la vue et coorddonner du marker sur notre recherche
            updateMap(markerSource, ui.item.y , ui.item.x)
        }
    });
}

// ---- A mettre dans layer.js ???
    // Créer un vecteur de source de recherche
    var markerSource = new ol.source.Vector({
        extent: [232e4,93e4,30e5,145e4],
    });
    
    // Créer une couche de vecteur pour afficher le marqueur
    var markerLayer = new ol.layer.Vector({
        source: markerSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: 'https://openlayers.org/en/latest/examples/data/icon.png' // URL de l'icône du marqueur
            }),
        })
    });

    // Ajouter la couche de marqueur à la carte
    map.addLayer(markerLayer);

    function addMarker(x, y) {
        var test = true
        // Vérifier si les coordonnées sont à l'intérieur de l'étendue
        if (x >= 232e4 && x <= 30e5 && y >= 93e4 && y <= 145e4) {
            return test
        }
    }

    function updateMap(markerSource, est, nord){
        var test = addMarker(est, nord)
        if (test) {
            // Modifier le centre de la carte
            mapView.setCenter([est , nord])

            // Mettre a jour coorddonner du marker sur notre recherche
            markerReserach(markerSource, est, nord)

            // Modifier le niveau de zoom
            mapView.setZoom(20);
        }
    }

    // Mettre a jour le marker
    function markerReserach(markerSource, est, nord){
        markerSource.clear()

        // Créer un marqueur (point) avec la nouvelle position
        var marker = new ol.Feature({
            geometry: new ol.geom.Point([est, nord])
        });

        // Ajouter le marqueur à la source du vecteur
        markerSource.addFeature(marker);
    }
// ---- Fin A mettre dans layer.js ???

// Retirer les balises HTML d'une chaîne de caractères
function stripHtmlTags(html) {
    var temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

// Declencher l'action de recherche
function launchSearch() {
    // Récupérer la valeur du champ de recherche
    var formattedQuery = recoveryData();

    // Si la requête est vide, ne rien faire
    if (formattedQuery === '') {
        return;
    }

    // Construire l'URL avec la requête de recherche
    var url = locationApiGeoadmin(formattedQuery);

    // Envoyer url
    fetchDataFromURL(url);
}


// Configurer Typeahead.js
$(document).ready(function () {
    // Gestionnaire d'événement pour le changement de contenu dans le champ de recherche
    // Lancer la recherche à chaque changement dans le champ de recherche
    $('#searchInput').on('input', launchSearch);
});