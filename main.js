window.onload = init

function init(){

    // Controls

    var view = new ol.View({
        center:[8416686.663317095, 1731974.509331715],
        zoom:15
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

    var Model_Nersery = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'./lib/spatial_data/lup_nursery.geojson',
            format: new ol.format.GeoJSON()
        })
    })
    //map.addLayer(IndiaFile);

    var Uni_Boundry = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'./lib/spatial_data/Boundry.geojson',
            format: new ol.format.GeoJSON()
        })
    });

    var Road = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'./lib/spatial_data/Road.geojson',
            format: new ol.format.GeoJSON()
        })
    });

    var Stream = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'./lib/spatial_data/Stream.geojson',
            format: new ol.format.GeoJSON()
        })
    })
        //Layer Switcher
        const allLayer = new ol.layer.Group({
            layers:[Model_Nersery,Uni_Boundry,Stream, Road]
        });
    
        map.addLayer(allLayer);

    const scaleLine = new ol.control.ScaleLine({
    });
    map.addControl(scaleLine);

    const overlayContainerElement = document.querySelector('.overlay-container');

    const overlayLayer = new ol.Overlay({
        element: overlayContainerElement
    });

    map.addOverlay(overlayLayer);

    const overlayName = document.getElementById('feature-name');
    const overlayArea = document.getElementById('feature-area');
    //const overlayGeom = document.getElementById('feature-geometry')

    map.on('click', function(e){
        const coordinate =  e.coordinate;
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            let featureName = feature.get('lup'); //.getKeys()
            let featureArea = feature.get('area_msqr');
            //let featureGeom = feature.get('photo');
            overlayLayer.setPosition(coordinate);
            overlayName.innerHTML = '1)Feature Name: ' + featureName;
            overlayArea.innerHTML = '2)Feature Area: ' + featureArea + '(Sqr-Mtrs)';
            //overlayGeom.innerHTML = 'Feature Geometry : ' + featureGeom;
            //console.log(feature.getKeys());  //.getKeys()
        })
    });

    map.on('click', function(e){
        console.log(e.coordinate);
    })

    
}