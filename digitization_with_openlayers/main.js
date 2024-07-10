var drawInteraction, startedit, stopedit;

/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');


var layer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url:"http://localhost:8080/geoserver/cite/wms?",
    params:{
      LAYERS:'features'
    }
  })
});


/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var map = new ol.Map({
  target: 'map',
  overlays: [overlay],
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([74.6112069940567, 16.86419429706548]),
    zoom: 17,
  }),
});

var drawLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#FF0000',
      width: 2,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, 0.1)',
    }),
  }),
});
map.addLayer(drawLayer);

drawInteraction = new ol.interaction.Draw({
  type: 'Polygon',
  source: drawLayer.getSource(),
});

var startedit = document.getElementById('start-edit');
startedit.addEventListener('click', startbutton);

function startbutton() {
  console.log('Start Edit');
  map.addInteraction(drawInteraction);
  startedit.disabled = true; // Disable the start button when editing starts
  stopedit.disabled = false; // Enable the stop button
}

var stopedit = document.getElementById('stop-edit');
stopedit.addEventListener('click', stopbutton);

function stopbutton() {
  console.log('Stop Edit');
  map.removeInteraction(drawInteraction);
  startedit.disabled = false; // Enable the start button when editing stops
  stopedit.disabled = true; // Disable the stop button
}

// Listen for drawend event
drawInteraction.on('drawend', function (event) {
  var feature = event.feature;
  var geometry = feature.getGeometry();
  displayPopup(geometry);
});

function displayPopup(geometry) {
  var extent = geometry.getExtent();
  var center = ol.extent.getCenter(extent);

  var popupContent = `
    <table id='table'>
      <tr>
        <th>Name:</th>
        <th>Distance:</th>
      </tr>
      <tr>
        <td><textarea name='name' id='name'></textarea></td>
        <td><textarea name='dist' id='dist'></textarea></td>
        <td><button id='saveButton'>Save Feature</button></td>
      </tr>
    </table>
  `;
  content.innerHTML = popupContent;
  overlay.setPosition(center);

  // Event listener for the save button click
  document.getElementById('saveButton').addEventListener('click', function (event) {
    var nameTextArea = document.getElementById('name');
    var distTextArea = document.getElementById('dist');
    if (nameTextArea && distTextArea) {
      var nameText = nameTextArea.value;
      var distText = distTextArea.value;

      console.log('Saving feature with name:', nameText);

      var geoJSON = new ol.format.GeoJSON();
      var feature = new ol.Feature(geometry);
      feature.setProperties({ name: nameText, distText: distText });

      // Call saveFeature for each feature drawn
      saveFeature(feature);
    } else {
      console.log('#name or #dist textarea element not found in DOM.');
    }
  });
}

function saveFeature(feature) {
  var geoJSON = new ol.format.GeoJSON();
  var geometry = geoJSON.writeGeometry(feature.getGeometry(), {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  });

  var name = feature.get('name');
  var distText = feature.get('distText');

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/save_feature', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var response = xhr.responseText;
        alert(response); // Alert response from server (success or error message)
      } else {
        alert('Error saving feature. Please try again.');
      }
    }
  };

  // Send geometry and attributes as JSON payload
  xhr.send(JSON.stringify({ geometry: geometry, name: name, distText: distText }));
}



var source = layer.getSource();
var params = source.getParams();
params.t = new Date().getMilliseconds();
source.updateParams(params);
map.addLayer(layer);
