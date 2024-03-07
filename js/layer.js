//--------------- VARIABLES -----------------  
// URL de base pour les services WMS
const wmsUrlGeoadmin = "https://wms.geo.admin.ch/";
// URL de base pour les attributions
const attributionUrlGeoadmin = "https://www.geo.admin.ch/fr/home.html";
// Code pour la projections Suisse
const projectionCode = "EPSG:2056";

//--------------- PROJETION -----------------  
// Projection suisse
const projection = new ol.proj.Projection({
  code: projectionCode,
  units: "m"
});

//--------------- VUE-----------------  
// Définition de la vue de la carte
const mapView = new ol.View({
  center: [2660000, 1190000],
  projection: projection,
  zoom: 8,
  extent: [232e4, 93e4, 30e5, 145e4],
});

//--------------- FOND DE PLAN -----------------  
const nationalMapCH = new ol.layer.Tile({
  source: new ol.source.TileWMS({
      url: wmsUrlGeoadmin,
      params: { layers: "ch.swisstopo.pixelkarte-farbe" },
      attributions: [`Fond de plan &copy; <a href="${attributionUrlGeoadmin}">WMTS CarteNationale / geo.admin.ch</a>`]
  }),
  opacity: 0.6,
  visible: false
});

const swissImage = new ol.layer.Tile({
  source: new ol.source.TileWMS({
      url:wmsUrlGeoadmin,
      params: { layers: "ch.swisstopo.swissimage" },
      attributions: [`Fond de plan &copy; <a href="${attributionUrlGeoadmin}">WMTS SWISSIMAGE / geo.admin.ch</a>`]
  }),
  opacity: 0.6,
  visible: false
});

const swissSurface3D = new ol.layer.Tile({
  source: new ol.source.TileWMS({
      url:wmsUrlGeoadmin,
      params: { layers: "ch.swisstopo.swisssurface3d-reliefschattierung-multidirektional" },
      attributions: [`Fond de plan &copy; <a href="${attributionUrlGeoadmin}">WMTS Relief multidir. issu de SwissSURFACE3D / geo.admin.ch</a>`]
  }),
  opacity: 0.9,
  visible: false
});

const MO_nb = new ol.layer.Tile({
  id: "background-layer",
  source: new ol.source.TileWMS({
      url: `https://geodienste.ch/db/av_0/fra?`,
      params: { 'LAYERS': 'LCSF,LCSFPROJ,Conduites,SOLI,SOSF,SOPT,Adresses_des_batiments,Nomenclature,Biens_fonds,Biens_fonds_projetes,Limites_territoriales', 'TILED': true },
      attributions: "Fond de plan &copy; <a href=\"https://geodienste.ch\">geodienste</a>",
  }),
  zIndex: -99,
  visible: false
});

//--------------- LAYERS -----------------  
const Restrictions_CH = new ol.layer.Tile({
  source: new ol.source.TileWMS({
      url:wmsUrlGeoadmin,
      projection: projectionCode,
      params: {
          layers: "ch.bazl.einschraenkungen-drohnen",
      },
      attributions: [`&copy; <a href="${attributionUrlGeoadmin}">Zones géographiques UAS en Suisse / OFAC</a>`]
  }),
  opacity: 0.5
});

const obstaclesNavigation = new ol.layer.Tile({
  source: new ol.source.TileWMS({
      url:wmsUrlGeoadmin,
      projection: projectionCode,
      params: {
          layers: "ch.bazl.luftfahrthindernis",
      },
      attributions: [`&copy; <a href="${attributionUrlGeoadmin}">Obstacles à la navigation aérienne / OFAC</a>`]
  }),
  opacity: 0.8,
  visible: false
});

//--------------- INITIALISATION CARTE -----------------  
const map = new ol.Map({
  target: 'map',
  view: mapView,
  layers: [nationalMapCH, swissImage, swissSurface3D, MO_nb, Restrictions_CH, obstaclesNavigation],
});

// Activer le fond de carte national par défaut
nationalMapCH.setVisible(true);

//--------------- CHANGEMENT FOND CARTE-----------------  
// Gestionnaire d'événement pour le changement de sélection du fond de carte
// Est-ce qu'on fait une fonction ?
const selectBackground = document.getElementById('selectBackground');
selectBackground.addEventListener('change', function () {
  const selectedValue = selectBackground.value;

  [nationalMapCH, swissImage, swissSurface3D, MO_nb].forEach(function (layer) {
      layer.setVisible(layer === selectedValue);
  });
});

//--------------- CHANGEMENT LAYER-----------------  
// Fonction générique pour gérer le changement de visibilité des couches
function addLayerVisibilityChangeListener(layer, checkboxElement) {
  checkboxElement.checked = layer.getVisible(); // Cocher ou décocher en fonction de la visibilité actuelle

  checkboxElement.addEventListener('change', function () {
      layer.setVisible(checkboxElement.checked);
  });
}

// Gestionnaire de changement de couche 
addLayerVisibilityChangeListener(Restrictions_CH, document.getElementById('restrictionsCheckbox'));
addLayerVisibilityChangeListener(obstaclesNavigation, document.getElementById('obstaclesCheckbox'));
