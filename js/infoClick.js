// Ajout d'un gestionnaire d'événement de clic sur la carte
map.on('click', function(event) {
    // Récupérer les coordonnées du clic
    var coordinate = event.coordinate;

    // Définir les paramètres de la requête GetFeatureInfo
    var getFeatureInfoParams = {
        'INFO_FORMAT': 'text/plain', // Format de réponse souhaité
        'FEATURE_COUNT': 1, // Nombre de features à retourner
        'X': Math.round(event.pixel[0]), // Position X du clic
        'Y': Math.round(event.pixel[1]), // Position Y du clic
        'QUERY_LAYERS': 'ch.bazl.einschraenkungen-drohnen', // Couche à interroger
        'LAYERS': 'ch.bazl.einschraenkungen-drohnen', // Couche à interroger
        'WIDTH': map.getSize()[0], // Largeur du conteneur de la carte
        'HEIGHT': map.getSize()[1], // Hauteur du conteneur de la carte
        'BBOX': map.getView().calculateExtent(map.getSize()) // Boîte englobante de la vue actuelle
    };

    // Envoyer une requête GetFeatureInfo au serveur WMS
    map.forEachLayerAtPixel(event.pixel, function(layer) {
        if (layer instanceof ol.layer.Tile) {
            var url = layer.getSource().getFeatureInfoUrl(
                coordinate, map.getView().getResolution(), map.getView().getProjection(),
                getFeatureInfoParams
            );

            if (url) {
                // Effectuer une requête Ajax pour récupérer les informations
                fetch(url)
                    .then(function(response) {
                        return response.text();
                    })
                    .then(function(text) {
                        console.log('Informations sur la couche de restriction:', text);
                    });
            }
        }
    });
});