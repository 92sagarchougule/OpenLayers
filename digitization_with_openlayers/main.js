var drawInteraction, startedit, stopedit;

/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

// WMS layer from geoserver
var layer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url:"http://localhost:8080/geoserver/cite/wms?",
    params:{
      LAYERS:'features'
    }
  })
});









// functioning for draw polygon and save data in db

const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});


// coloser for popup
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};


// draw a layer in vector
var drawLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 3,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, .8)',
    }),
  }),
});




document.getElementById('geometry').onchange = function(){

  var geom = document.getElementById('geometry').value;

console.log(geom);

}






// draw interaction
drawInteraction = new ol.interaction.Draw({
  type: 'Polygon', 
  source: drawLayer.getSource(),
});

// edit start and stop code
var startedit = document.getElementById('start-edit');
startedit.addEventListener('click', startbutton);

function startbutton() {
  console.log('Start Edit');
  map.addInteraction(drawInteraction);
  startedit.disabled = true; // Disable the start button when editing starts
  stopedit.disabled = false; // Enable the stop button
}


// Start edit
var stopedit = document.getElementById('stop-edit');
stopedit.addEventListener('click', stopbutton);
stopedit.disabled = true; // Enable the stop button

function stopbutton() {
  console.log('Stop Edit');
  map.removeInteraction(drawInteraction);
  startedit.disabled = false; // Enable the start button when editing stops
  stopedit.disabled = true; // Disable the stop button
  var source = layer.getSource();
  var params = source.getParams();
  params.t = new Date().getMilliseconds();
  source.updateParams(params);

}


// Listen for drawend event
drawInteraction.on('drawstart', function (event) {
  var source = layer.getSource();
  var params = source.getParams();
  params.t = new Date().getMilliseconds();
  source.updateParams(params);
});

// Listen for drawend event
drawInteraction.on('drawend', function (event) {
  var feature = event.feature;
  var geometry = feature.getGeometry();
  displayPopup(geometry);
});


// Function to get popup and add data
function displayPopup(geometry) {
  var extent = geometry.getExtent();
  var center = ol.extent.getCenter(extent);

  var popupContent = `
    <table id='table'>
      <tr>
        <th>Name:</th>
        <th>District:</th>
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


// function to add feature through api
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


// Geometry writing function
// var geoJSON = new ol.format.GeoJSON();
 // var geometry = geoJSON.writeGeometry(feature.getGeometry(), {







// Map class starts here ------------------------------------------------------------------------------------------------------


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


map.addLayer(drawLayer);

map.addLayer(layer);


// GeoJSON layer from GeoServer


// GeoJSON URL from GeoServer
var geojsonUrl = "http://localhost:8080/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Afeatures&maxFeatures=50&outputFormat=application%2Fjson";

// Style for the GeoJSON features

var my_style = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: 'blue',
    width: 1,
  }),
  fill: new ol.style.Fill({
    color:'rgb(0, 204, 0,.2)'
  })
});


var vector_style = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: 'red',
    width: 3.25,
  }),
  fill: new ol.style.Fill({
    color:'rgb(255,0,0,.1)'
  })
});

// Create a new Vector source and layer for GeoJSON features
var vectorSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: geojsonUrl, // Directly specify the URL
  strategy: ol.loadingstrategy.bbox // Use bbox strategy for loading GeoJSON
});

var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: my_style // Apply the defined style to the features
});

// Add the vector layer to the map
map.addLayer(vectorLayer);




let selectedFeature = null;



map.on('click',function(evt){
  // console.log(evt.coordinate);
        map.forEachFeatureAtPixel(evt.pixel, function(feature){
          // console.log(feature.get('name'));

          var current_fc = feature;
          
          
          if (selectedFeature) {
            selectedFeature.setStyle(undefined);
            // console.log('crossed this function');
            // console.log(selectedFeature);
          }

        // Set the style of the currently selected feature
        feature.setStyle(vector_style);
        // Update the selectedFeature variable
        selectedFeature = feature;
          

          return feature;


          fcdata(current_fc);

        })

        
  
})




// Event listener for delete button
document.getElementById('delete-fc').addEventListener('click', function(event) {
  console.log('Delete function called');

  // Function to handle feature data
  function fcdata(current_fc) {
      if (current_fc) {
          var nameText = current_fc.get('name'); // Assuming 'name' is a property of the feature

          // Call deletefeature with the selected feature's name
          deletefeature(nameText);
      } else {
          alert('Please Select feature !');
      }
  }

  // Call fcdata with the selected feature
  fcdata(selectedFeature);
});


// Function to delete feature through API
function deletefeature(nameText) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/delete_feature', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              var response = JSON.parse(xhr.responseText);
              alert(response.message); // Alert response from server (success or error message)
          } else {
              alert('Error deleting feature. Please try again.');
          }
      }
  };

  // Send name as JSON payload
  xhr.send(JSON.stringify({ name: nameText }));
}


























