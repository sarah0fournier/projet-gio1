// Ajout d'un gestionnaire d'événement de clic sur la carte
map.on('click', function(event) {
    // Récupérer les coordonnées du clic
    var coordinate = event.coordinate;

   // Calculer les coordonnées des coins du rectangle
var topLeft = [coordinate[0] - 2.5, coordinate[1] + 2.5];
var topRight = [coordinate[0] + 2.5, coordinate[1] + 2.5];
var bottomRight = [coordinate[0] + 2.5, coordinate[1] - 2.5];
var bottomLeft = [coordinate[0] - 2.5, coordinate[1] - 2.5];

// Formater les coordonnées pour la requête
var rectangleCoordinates = [
    [topLeft, topRight, bottomRight, bottomLeft, topLeft] // Premier anneau du polygone
];

    console.log('Coordonnées du rectangle :', rectangleCoordinates);
   
   
    var url = BuildUrlApiGeoadmin("ch.bazl.einschraenkungen-drohnen", rectangleCoordinates);
    
    // Appeler la fonction pour récupérer les données à partir de l'URL
    fetchDataFromURL(url);
});
  