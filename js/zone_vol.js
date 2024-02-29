//--------------- Interaction dessin zone de vol  ----------------- 

var drawInteraction; // Variable globale pour stocker l'interaction de dessin

// Créez une couche vectorielle pour stocker les traits dessinés
var vectorLayer = createVectorLayer();

// Interaction pour dessiner un polygone
var draw = createDrawInteraction(vectorLayer);

// Démarrez le dessin du polygone lorsque l'utilisateur clique sur le bouton
startDrawingOnClick(draw);

//--------------- FONCTIONS  ----------------- 

// Fonction pour créer une couche vectorielle pour stocker les traits dessinés
function createVectorLayer() {
    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    map.addLayer(vectorLayer);
    return vectorLayer;
}

// Fonction pour créer une interaction de dessin de polygone
function createDrawInteraction(vectorLayer) {
    var draw = new ol.interaction.Draw({
        source: vectorLayer.getSource(),
        type: 'Polygon'
    });
    return draw;
}

// Fonction pour activer l'interaction de dessin lorsque l'utilisateur clique sur le bouton
function startDrawingOnClick(draw) {
    var startDrawingButton = document.getElementById('startDrawingButton');
    startDrawingButton.addEventListener('click', function() {
        // Supprimer d'abord les entités de la couche vectorielle existante
        vectorLayer.getSource().clear();

        // Supprimer l'interaction de dessin existante si elle existe
        if (drawInteraction) {
            map.removeInteraction(drawInteraction);
        }
        
        // Activer l'interaction de dessin lorsque l'utilisateur clique sur le bouton
        drawInteraction = draw;
        map.addInteraction(drawInteraction);
    });
}

// Événement de fin de dessin pour récupérer les coordonnées du polygone
draw.on('drawend', function(event) {
    var feature = event.feature;
    var geometry = feature.getGeometry();
    var coordinates = geometry.getCoordinates();
    console.log('Coordonnées du polygone dessiné :', coordinates);

    var url = BuildUrlApiGeoadmin("ch.bazl.einschraenkungen-drohnen", coordinates);
    fetchDataFromURL(url);

    // Désactiver l'interaction de dessin une fois que le polygone a été dessiné
    map.removeInteraction(drawInteraction);
});

// Fonction pour construire l'URL de requête vers le serveur API map geo admin
function BuildUrlApiGeoadmin(layer, polygonCoordinates) {
    var url = "https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPolygon&geometry=" + encodeURIComponent(JSON.stringify({ "rings": polygonCoordinates })) + "&layers=all:" + encodeURIComponent(layer) + "&geometryFormat=geojson&sr=2056&tolerance=0";
    //console.log("URL de la requête:", url);
    return url;
}

// Fonction pour envoyer la requête de l'URL et recevoir les données
function fetchDataFromURL(url) {
    // Effectuez la requête HTTP
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json(); // Si la réponse est OK, retournez les données JSON
            } else {
                throw new Error('Erreur lors de la requête');
            }
        })
        .then(data => {
            // Appel de la fonction pour afficher les données des zones de vol restreintes
            displayZoneRestrictionData(data.results);
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
}

//--------------- SUREMENT D'AUTRE ZONE A DRY OU AUTRE AFFICHAGE  ----------------- 
// Fonction pour afficher les données des zones de vol de restriction
function displayZoneRestrictionData(results) {
    // Variable pour stocker les données des zones de vol restreintes
    var zonesData = [];

    // Parcours du tableau "results"
    results.forEach(function(result) {
        // Création d'un objet contenant les attributs spécifiés
        var zoneData = {
            zone_name_fr: result.properties.zone_name_fr,
            zone_restriction_fr: result.properties.zone_restriction_fr,
            zone_message_fr: result.properties.zone_message_fr,
            auth_url_fr: result.properties.auth_url_fr,
            auth_name_fr: result.properties.auth_name_fr,
            auth_contact: result.properties.auth_contact,
            auth_service_fr: result.properties.auth_service_fr,
            auth_email: result.properties.auth_email,
            auth_phone: result.properties.auth_phone
        };

        // Ajout de l'objet au tableau
        zonesData.push(zoneData);

        // Affichage du tableau dans la console ou autre traitement que vous souhaitez faire avec les données
        console.log(zonesData);
        // Faudra les afficher qqpart d'autre 
    });
}

