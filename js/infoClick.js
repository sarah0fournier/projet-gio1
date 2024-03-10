const element = document.getElementById('popup');
const popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
  });
  map.addOverlay(popup);

// Ajout d'un gestionnaire d'événement de clic sur la carte
map.on('click', function(event) {
    // $(element).popover('dispose'); 

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

    // NG : Tu veut recuperer comment les donnes url ? Mettre dans une variables eg. data = fetchDataFromURL(url);
    // Popup 
    // Position du popup au coords du clic
    popup.setPosition(coordinate);

    // Création du popUp
    element.innerHTML = `
        <div class="popUpTitre">Coordonnées du clic :</div>
        <div class="popUpTitre">Latitude : ${coordinate[1]}</div>
        <div class="popUpTitre">Longitude : ${coordinate[0]}</div>
    `;
    
    // Afficher la popup
    element.style.display = 'block';

});


// Gestion popup 
// 1. Afficher data dans popup
// 2. Gerer Popup si vide 

// Melange de jqery et javascript dans nos scripts / fct. Pose pbl ? 
