window.onload = init

function init(){

    // Controls

    var view = new ol.View({
        center:[8415930.665801784, 1731707.0831358973],
        zoom:17.5
    });

    var layer = new ol.layer.Tile({
            source: new ol.source.OSM(),
            visible:true,
            title:'OpenStreetMap'
    });
    
    var map = new ol.Map({
        target:'map'
    });

    map.addLayer(layer);
    map.setView(view);

    var IndiaFile = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'./lib/spatial_data/lup_nursery.geojson',
            format: new ol.format.GeoJSON()
        })
    })

    map.addLayer(IndiaFile);

    const overlayContainerElement = document.querySelector('overlay-container');

    const overlayAtt = new ol.Overlay({
        element: overlayContainerElement
    })

    map.addOverlay(overlayAtt);

    const overlayFeatureName = document.getElementById('feature-name');
    const overlayFeatureArea = document.getElementById('feature-area');


    map.on('click', function(event){
        //console.log(event.coordinate)
        overlayAtt.setPosition(undefined);        
        map.forEachFeatureAtPixel(event.pixel, function(feature, layer){
            let Clickecoordinates = event.coordinate;
            const lup = feature.get('lup');
            const fcarea = feature.get('area_msqr');
            overlayAtt.setPosition(Clickecoordinates);
            overlayFeatureName.innerHTML = lup;
            overlayFeatureArea.innerHTML = fcarea;
        });
    })
}