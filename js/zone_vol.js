//--------------- Interaction dessin de la zone de vol et requete  ----------------- 
       
// Créez une couche vectorielle pour stocker les traits dessinés
var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector()
  });
  map.addLayer(vectorLayer);
  
// Interaction pour dessiner un polygone
var draw = new ol.interaction.Draw({
source: vectorLayer.getSource(), // couche vectorielle créée
type: 'Polygon' // type comme 'Polygon' pour pouvoir le fermer
});
map.addInteraction(draw);


var url; // Déclaration de la variable url à l'extérieur de la fonction draw.on

// Événement de fin de dessin pour récupérer les coordonnées du polygone
draw.on('drawend', function(event) {
    // Obtenir le polygone dessiné
    var feature = event.feature;

    // Récupérer les coordonnées du polygone dessiné
    var geometry = feature.getGeometry();
    var coordinates = geometry.getCoordinates();
    console.log('Coordonnées du polygone dessiné :', coordinates);
  
    // Appelez la fonction de rappel avec les données nécessaires
    // Seulment pour la couche restriction drone pour l'instant ? 
    url = BuildUrlApiGeoadmin("ch.bazl.einschraenkungen-drohnen", coordinates);
});


//--------------- DECLARATION DES FONCTIONS  ----------------- 

// Fonction pour construir l'url de requete vers le serveur API map geo admin
function BuildUrlApiGeoadmin(layer, polygonCoordinates) {
    // Requête avec callback
    // Voir si pour autre couches c'est la même url ?
    var url = "https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPolygon&geometry=" + encodeURIComponent(JSON.stringify({ "rings": polygonCoordinates })) + "&layers=all:" + encodeURIComponent(layer) + "&geometryFormat=geojson&sr=2056&tolerance=0";
    console.log("URL de la requête:", url);
}
