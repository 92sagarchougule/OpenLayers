
var drawInteraction, stopedit, startedit;

/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
// const save = document.getElementById('saveButton');

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
    center:ol.proj.fromLonLat([74.6112069940567, 16.86419429706548]),
    zoom: 17,
  }),
});


var layer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url:"http://localhost:8080/geoserver/cite/wms?",
    params:{
      LAYERS:'features'
    }
  })
});



var source = layer.getSource();
var params = source.getParams();
params.t = new Date().getMilliseconds();
source.updateParams(params);
map.addLayer(layer);



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

// stopedit.disabled = true;

  // stopedit.disabled = true;

  startedit = document.getElementById('start-edit');
  startedit.addEventListener('click', startbutton);
    function startbutton() {
      console.log('Start Edit');
      map.addInteraction(drawInteraction);
      startedit.disabled = true;

    }

  stopedit = document.getElementById('stop-edit');
  stopedit.addEventListener('click', stopbutton);
    function stopbutton() {
      console.log('Stop Edit');
      map.removeInteraction(drawInteraction);
      stopedit.disabled = true;
      startedit.disabled = true;
    }




// Listen for drawend event
drawInteraction.on('drawend', function (event) {
  var feature = event.feature;
  var geometry = feature.getGeometry();
  displayPopup(geometry);
// map.addLayer(layer);
});


// Global variable to hold the text from the textarea
var nameText = '';

function displayPopup(geometry) {
  var extent = geometry.getExtent();
  var center = ol.extent.getCenter(extent);

  // var popupContent ='<table><p> Name:</p><code> <textarea name="name" id="name"></textarea> </code><br>';
  //     popupContent += '<p> Dist:</p><code> <textarea name="dist" id="dist"></textarea> </code><br>';
  //     popupContent += '<button id="saveButton">Save Feature</button> </table>';
  var popupContent ="<table id='tabel'><tr> <th> Name:</th> <th> Dist : </th> </tr> <tr> <td> <textarea name='name' id='name'></textarea> </td> <button id='saveButton'>Save Feature</button> </td>   <td> <textarea name='dist' id='dist'></textarea> </td> <table> ";
  content.innerHTML = popupContent;
  overlay.setPosition(center);

  // Event listener for the save button click
  // Event listener for the save button click
document.addEventListener('click', function saveButtonClick(event) {
    if (event.target && event.target.id === 'saveButton') {
      // Remove the event listener to prevent multiple executions
      document.removeEventListener('click', saveButtonClick);
  
      // Retrieve the value from the textarea
      var nameTextArea = document.getElementById('name');
      var distTextArea = document.getElementById('dist');
      if (nameTextArea && distTextArea) {
        var nameText = nameTextArea.value;
        var distText = distTextArea.value;

        console.log('Saving feature with name:', nameText);
  
        var geoJSON = new ol.format.GeoJSON();
        var features = drawLayer.getSource().getFeatures();
        if (features.length > 0) {
          var feature = features[0]; // Assuming only one feature is drawn
          var geometry = geoJSON.writeGeometry(feature.getGeometry(), {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          });
  
          // Call saveFeature only once
          saveFeature(geometry, nameText, distText);
        } else {
          alert('No feature drawn to save.');
        }
      } else {
        console.log('#name textarea element not found in DOM.');
      }
    }
  });
}



// map.on('click', function(evt){
//   console.log(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
// })



// Example usage outside the function
function saveFeature(geometry, name, distText) {
  // AJAX call to save geometry and name in PostgreSQL
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

  // Send geometry and name as JSON payload
  xhr.send(JSON.stringify({ geometry: geometry, name: name, distText: distText }));
  console.log('HI');

  layer.getSource().changed();

}


