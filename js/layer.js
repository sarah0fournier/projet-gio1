//--------------- Initialisation map avec les fond de la map  ----------------- 

// Projection suisse
const projection = new ol.proj.Projection({
  code: "EPSG:2056",
  units: "m"
});

// Définition de la carte 
var mapView = new ol.View ({
    center: [2660000, 1190000], // c'est en suisse
    projection :projection,
    zoom: 15,
    extent: [232e4,93e4,30e5,145e4],

});

// Fond WMTS CN a echelle dynamique
const carteNationale = new ol.layer.Tile({
  source: new ol.source.TileWMS({
      url: "https://wms.geo.admin.ch/",
      params: { layers: "ch.swisstopo.pixelkarte-farbe" },
      attributions: ["&copy; <a href=\"https://www.geo.admin.ch/fr/home.html\">WMTS CarteNationale / geo.admin.ch</a>"]
  }),
  opacity: 0.5
});

  // Restriction drone a l echelle de la suisse
  const attributions_geodienste = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: "https://wms.geo.admin.ch/",
      projection: 'EPSG:2056',
      params: {
        layers: "ch.bazl.einschraenkungen-drohnen",
        },
      attributions: ["Fond de plan &copy; <a href=\"https://www.geo.admin.ch/fr/home.html\">WMTS Relief multidir. issu de SwissSURFACE3D / geo.admin.ch</a>"]
    }),
    opacity: 0.5
  });

// Ajout et initialisation de la carte 
var map = new ol.Map ({
    target : 'map',
      view : mapView,
      layers: [carteNationale, attributions_geodienste],
        });



