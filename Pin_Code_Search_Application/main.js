// Sagar Chougule

var geoJsonSource, locationLayer; // Declare the variable globally

map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  interactions: ol.interaction.defaults({ mouseWheelZoom: false, doubleClickZoom: false,dragAndDrop: false,keyboardPan: false,
    keyboardZoom: false,DragZoom: false,DragPan: false,pointer: false,select: false,DragRotate: false,PinchRotate: false,PinchZoom: false,
  }),
  view: new ol.View({
    center: ol.proj.fromLonLat([75.54, 21.00]),   //8404194.024648452, 2387326.2313056597
    zoom: 9, // Adjust the zoom level
  }),
});

fetch('./lib/data/location.geojson')
  .then(response => response.json())
  .then(geoJsonData => {
    geoJsonSource = new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(geoJsonData, {
        featureProjection: 'EPSG:3857', // Adjust based on your data projection
      }),
    });

    var pointStyle = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 8,
        fill: new ol.style.Fill({ color: 'blue' }),
        stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
      }),
    });

    locationLayer = new ol.layer.Vector({
      source: geoJsonSource,
      style: pointStyle,
    });

    map.addLayer(locationLayer);
  });

// Create an overlay to display the popup
var popup = new ol.Overlay({
  element: document.getElementById('popup'),
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50],
});
map.addOverlay(popup);

// Close the popup when the closer is clicked
document.getElementById('popup-closer').onclick = function () {
  popup.setPosition(undefined);
  return false;
};

// Add click event to the map
map.on('click', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature) {
    var coordinates = feature.getGeometry().getCoordinates();
    var properties = feature.getProperties();

    // Customize the popup content based on feature properties
    var popupContent =
      '<table class="table table-bordered table-striped">' +
      '<tr><td>Latitude</td><td>' + properties.Latitude + '</td></tr>' +
      '<tr><td>Longitude</td><td>' + properties.Longitude + '</td></tr>' +
      '<tr><td>Sr</td><td>' + properties.Sr + '</td></tr>' +
      '<tr><td>State</td><td>' + properties.State + '</td></tr>' +
      '<tr><td>Division</td><td>' + properties.Division + '</td></tr>' +
      '<tr><td>District</td><td>' + properties.District + '</td></tr>' +
      '<tr><td>Block</td><td>' + properties.Block + '</td></tr>' +
      '<tr><td>Census_Village</td><td>' + properties.Census_Vil + '</td></tr>' +
      '<tr><td>Village_Name</td><td>' + properties.Village_Na + '</td></tr>' +
      '<tr><td>Panchayat</td><td>' + properties.Panchayat + '</td></tr>' +
      '<tr><td>Located_in_Panchayat_Village_(Y/N)</td><td>' + properties.Name_of_VL + '</td></tr>' +
      '<tr><td>Pin_Code</td><td>' + properties.PIN_code + '</td></tr>' +
      '<tr><td>VLE_Email</td><td>' + properties.VLE_email + '</td></tr>' +
      '<tr><td>STD_Code</td><td>' + properties.STD_CODE + '</td></tr>' +
      '<tr><td>Mobile_No</td><td>' + properties.Mobile_No + '</td></tr>' +
      '<tr><td>Center_Registered Address</td><td>' + properties.Center_Reg + '</td></tr>' +
      '<tr><td>Gender_(M/F)</td><td>' + properties.Gender + '</td></tr>' +
      '<tr><td>UR_(U/R)</td><td>' + properties.UR + '</td></tr>' +
      '</table>';

    // Set the popup content and position
    document.getElementById('popup-content').innerHTML = popupContent;
    popup.setPosition(coordinates);
  } else {
    popup.setPosition(undefined);
  }
});

// Add a close button to the popup
document.getElementById('popup-closer').onclick = function () {
  popup.setPosition(undefined);
  return false;
};



// Function for Search Pin code and Zoom Extent

function searchByPIN() {
  var pinCode = document.getElementById('pinCodeSearch').value;

  if (geoJsonSource && locationLayer) {
    var features = geoJsonSource.getFeatures();

    // Reset styles for all features
    features.forEach(function (feature) {
      feature.setStyle(null);
    });

    // Filter features based on the PIN code
    var matchingFeatures = features.filter(function (feature) {
      var properties = feature.getProperties();
      // Convert PIN_code to a string for comparison
      return properties.PIN_code.toString() === pinCode;
    });

    if (matchingFeatures.length > 0) {
      // Style for matching features (red color)
      var matchingStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 12,
          fill: new ol.style.Fill({
            color: 'red'
          })
        })
      });

      // Apply the style to matching features
      matchingFeatures.forEach(function (feature) {
        feature.setStyle(matchingStyle);
      });

      // Calculate the extent of all features with the same PIN code
      var extent = ol.extent.createEmpty();
      matchingFeatures.forEach(function (feature) {
        var featureExtent = feature.getGeometry().getExtent();
        ol.extent.extend(extent, featureExtent);
      });

      // Set a specific zoom level (e.g., 10)
      var zoomLevel = 11;

      // Fit the map to the calculated extent with the specified zoom level
      map.getView().fit(extent, {
        size: map.getSize(),
        maxZoom: zoomLevel,
        duration: 500
      });
    } else {
      alert('PIN Code not found');
    }
  }
}