//--------------- Interaction avec la carte pour dessiner une zone de vol  ----------------- 

// Créez une couche vectorielle pour stocker les traits dessinés
var vectorLayer = createVectorLayer();

// Interaction pour dessiner un polygone
var draw = createDrawInteraction(vectorLayer);

// Événement de fin de dessin pour récupérer les coordonnées du polygone
draw.on('drawend', handleDrawEnd);

// Démarrez le dessin du polygone lorsque l'utilisateur clique sur le bouton
startDrawingOnClick(draw);

//--------------- FONCTIONS  ----------------- 

// Fonction pour créer une couche vectorielle pour stocker les traits dessinés
// ?? A voir si ok avec les pricipe
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

// Fonction pour gérer l'événement de fin de dessin du polygone
function handleDrawEnd(event) {
    var feature = event.feature;
    var geometry = feature.getGeometry();
    var coordinates = geometry.getCoordinates();
    console.log('Coordonnées du polygone dessiné :', coordinates);

    var url = BuildUrlApiGeoadmin("ch.bazl.einschraenkungen-drohnen", coordinates);
    fetchDataFromURL(url);
}

// Fonction pour activer l'interaction de dessin lorsque l'utilisateur clique sur le bouton
function activateDrawInteraction(draw) {
    map.addInteraction(draw);
}

// Fonction pour démarrer le dessin du polygone lorsque l'utilisateur clique sur le bouton
function startDrawingOnClick(draw) {
    var startDrawingButton = document.getElementById('startDrawingButton');
    startDrawingButton.addEventListener('click', function() {
        activateDrawInteraction(draw);
    });
}
// Fonction pour construire l'URL de requête vers le serveur API map geo admin
function BuildUrlApiGeoadmin(layer, polygonCoordinates) {
    var url = "https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPolygon&geometry=" + encodeURIComponent(JSON.stringify({ "rings": polygonCoordinates })) + "&layers=all:" + encodeURIComponent(layer) + "&geometryFormat=geojson&sr=2056&tolerance=0";
    console.log("URL de la requête:", url);
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
            console.log('Données récupérées avec succès :', data); // Afficher les données récupérées dans la console
            return data;
        })
        .catch(error => {
            console.error('Erreur :', error);
            return null;
        });
}