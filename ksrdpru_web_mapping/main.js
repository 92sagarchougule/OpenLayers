window.onload = init

function init(){
    // main classes
    const map = new ol.Map({ // map class
        view: new ol.View({  // view class
            //projection:'EPSG:4326',
            center:[8416598.169912841, 1731976.3818193525],
            zoom:15
        }),
        target:'map'
    });

    var base_maps = new ol.layer.Group({
        'title': 'Base maps',
        fold:true,
        layers: [
            new ol.layer.Tile({
                title: 'Satellite',
                type: 'base',
                visible: true,
                source: new ol.source.XYZ({
                    attributions: ['Powered by Esri',
                        //'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
                    ],
                    attributionsCollapsible: false,
                    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    maxZoom: 23
                })
            }),

            new ol.layer.Tile({
                title: 'OSM',
                type: 'base',
                visible: false,
                source: new ol.source.OSM()
            })
        ]
    });

    map.addLayer(base_maps);
    //Added Layer from Geoserver
    
    
    //Contour Layer from Geoserver
/*
    const contour = new ol.layer.Tile({
        source:new ol.source.TileWMS({
            url:'http://localhost:8080/geoserver/wms',
            params:{'LAYERS':'ksrdpru:contour.'},
            serverType:'geoserver'
        }),
        title:'Contour'
    });
    map.addLayer(contour);
  
    
    const Boundry = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'ksrdpru:lineboundry'},
            serverType: 'geoserver'
          }),
          title:'Boundry'
    });
    map.addLayer(Boundry);
    
    */


    //Building Layer from Geoserver
    const Building = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'ksrdpru:buildings', 'src':'EPSG:4326', 'transparent':true},
            serverType: 'geoserver'
          }),
          title:'Building'
    });
    //map.addLayer(Building);

    

    var Style  = new ol.style.Style({

        image: new ol.style.Circle({
            radius:8,
            fill: new ol.style.Fill({
                color:'#ed0c39'
            }),
            stroke: new ol.style.Stroke({
                color:'#0ced2e',
                width:2
            })
        })
    });

    var builPhoto = new ol.layer.Vector({
        title:'Landmark',
        source: new ol.source.Vector({
            url:'./lib/spatial_data/Building.geojson',
            format: new ol.format.GeoJSON()
        }),
        style:Style
    });


    map.addLayer(builPhoto);

    var source = builPhoto.getSource();
    source.forEachFeature(function(feature){
    var coord = feature.getGeometry().getCoordinates();
    alert(coord);
    // ...
    });



    var Boundry = new ol.layer.Vector({
        title:'Uni Boundry',
        source: new ol.source.Vector({
            url:'./lib/spatial_data/Lineboundry.geojson',
            format: new ol.format.GeoJSON()
        })
    });

    map.addLayer(Boundry);
    


    var GpLayer = new ol.layer.Group({
        title:'Local Layers',
        fold:true,
        layers:[builPhoto,Building]
    });
    //map.addLayer(GpLayer);
    // GeoJSON layer added from local folder
    /*
    const Nursery = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'./lib/spatial_data/lup_nursery.geojson',
            format: new ol.format.GeoJSON(),
            
        }),
        title:'Model Nursery'
    });

    map.addLayer(Nursery);

    */
    

    // ScaleBar
    var scale_line = new ol.control.ScaleLine({
        units: 'metric',
        bar: true,
        steps: 6,
        text: true,
        minWidth: 140,
        target: 'scale_bar'
    });
    map.addControl(scale_line);
    

    var MouseOv = new ol.control.MousePosition({
        projection:'EPSG:4326',
        className:'MousePosi',
        coordinateFormat: function(coordinate){
            return ol.coordinate.format(coordinate,'{y},{x}',6);
        }
    });
    map.addControl(MouseOv);
    // Verbal Scale
    /*
    function scale() {
        var resolution = map.getView().get('resolution');
    
        var units = map.getView().getProjection().getUnits();
    
        var dpi = 25.4 / 0.28;
        var mpu = ol.proj.Units.METERS_PER_UNIT[units];
        //alert(resolution);
        var scale = resolution * mpu * 39.37 * dpi;
        //alert(scale);
        if (scale >= 9500 && scale <= 950000) {
            scale = Math.round(scale / 1000) + "K";
        } else if (scale >= 950000) {
            scale = Math.round(scale / 1000000) + "M";
        } else {
            scale = Math.round(scale);
        }
        document.getElementById('scale_bar1').innerHTML = "Scale = 1 : " + scale;
    }
    scale();
    
    map.getView().on('change:resolution', scale);
    */

    // LayerSwitcher
    var layerSwitcher = new ol.control.LayerSwitcher({
        activationMode: 'click',
        startActive:true,
        groupSelectStyle:'children',
        collapseTipLabel: 'Collapse layers'
    })
    map.addControl(layerSwitcher);

    // style for landmark

    
    
    
    

    

    /*

    var Style  = new ol.style.Style({

        image: new ol.style.Circle({
            radius:7,
            fill: new ol.style.Fill({
                color:'#3399CC'
            })
        })
    });
    */

    /*
    var stylePic = new ol.style.Style({
        image: new ol.style.Icon({
            anchor:[0.1,0.1],
            anchorXUnits:'fraction',
            anchorYUnits:'pixels',
            src:'./lib/spatial_data/Photos/Location.jpg'
        })
    })
    */

    /*
    map.on('click', function(e){
        console.log(e.coordinate);
    })
    */
  /*
    var marker = new ol.Feature({
        geometry: new ol.geom.Point([8416598.169912841, 1731976.3818193525]),
        type:'KSRDPRU',
        name:'KSRDPRU',
    });

    var marker1 = new ol.Feature({
        geometry: new ol.geom.Point([8416321.21002996, 1732455.680917037]),
        type:'School_Building',
        name:'School_Building'
    });

    var marker2 = new ol.Feature({
        geometry: new ol.geom.Point([8416807.590552777, 1731320.5894264234]),
        type:'Quarters',
        name:'D-Quarters'
    });

    var marker3 = new ol.Feature({
        geometry: new ol.geom.Point([8416395.119204182, 1731705.363838025]),
        type:'Sabarmati',
        name:'Sabarmati Ashram'
    });

    */
    /*
    const BuilidJson = new ol.layer.Vector({
        
        source: new ol.source.Vector({
            url:'./lib/spatial_data/Lineboundry.geojson',
            format: new ol.format.GeoJSON()
            
        }),
        title:'Boundry'
    });

    map.addLayer(BuilidJson);
    */
/*

   
    var marklayer = new ol.layer.Vector({
        title:'University Locations',
        source: new ol.source.Vector({.grid-container{
    display:grid;
    grid-template-columns: 85vw 15vw;
    grid-template-rows: 100vh;
    border-top: 3px;
    border-left: 3px;
    border-right: 3px;
    border-bottom: 3px;
    border-color: black;
    padding: 1px;
    border-width: 2px;
    border-style: groove;
    color: blue;
    font-family: "Lucida Console", "Courier New", monospace;
    padding: 3px;
}
.sidebar{
    margin-left:15px;
}

#popup-coordinate{
    position:'relative';
    background-color: green;
}

.overlay-container{
    background-color: lightgreen;
    border-top: 3px;
    border-left: 3px;
    border-right: 3px;
    border-bottom: 3px;
    border-color: black;
    padding: 1px;
    text-align: center;
    align-items: center;
    border-width: 2px;
    border-style: groove;
    color: blue;
    font-family: "Lucida Console", "Courier New", monospace;
    padding: 6px;
}
#feature-area{
    box-sizing: 20px;
    image-resolution: 30px;

}overlay
            url:'./lib/spatial_data/buildings.geojson',
            format: new ol.format.GeoJSON()
        }),
        style: function(feature, resolution){
            return getStyle(feature, resolution);
        }
    });
    
    getStyle = function(feature, resolution){
        if(feature.get('Name') == 'Goshala'){
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor:[0.5, 10],
                    anchorXUnits:'fraction',
                    anchorYUnits:'pixels',
                    src:'./lib/spatial_data/Photos/Location1.jpg',
                })
            })
        }

        else if(feature.get('Name') == 'Nursery Model'){
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor:[0.5, 10],
                    anchorXUnits:'fraction',
                    anchorYUnits:'pixels',
                    src:'./lib/spatial_data/Photos/Location2.jpg',
                })
            })
        }

        else if(feature.get('Name') == 'Lake'){
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor:[0.5, 10],
                    anchorXUnits:'fraction',
                    anchorYUnits:'pixels',
                    src:'./lib/spatial_data/Photos/Location4.jpg',
                })
            })
        }

        else if(feature.get('Name') == 'Bird Sanctury'){
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor:[0.5, 10],
                    anchorXUnits:'fraction',
                    anchorYUnits:'pixels',
                    src:'./lib/spatial_data/Photos/Location6.jpg',
                })
            })
        }

        else {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor:[0.5, 10],
                    anchorXUnits:'fraction',
                    anchorYUnits:'pixels',
                    src:'./lib/spatial_data/Photos/Location7.jpg',
                })
            })
        }
    }

    map.addLayer(marklayer);
    */

    const overlayContainerElement = document.querySelector('.overlay-container');

    const overlayName = document.getElementById('feature-name');
    const overlayArea = document.getElementById('feature-area');
    const overlayDesc = document.getElementById('feature-desc');
    var closer = document.getElementById('popup-closer');

    const overlayLayer = new ol.Overlay({
        element: overlayContainerElement
    });

    map.addOverlay(overlayLayer);
    

    closer.onclick = function() {
        overlayLayer.setPosition(undefined);
        closer.blur();
        return false;
    };

    
    featureOverlay = new ol.layer.Vector({
        tile:'highlight',
        source: new ol.source.Vector(),
        map: map
    });

    map.on('click', highlight);

    function highlight(evt) {
        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
            
        }
        
        feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                return feature;
            });
            
    
        if (feature) {
            const coordinate =  evt.coordinate;
            let featureName = feature.get('Name'); //.getKeys()
            let featureArea = feature.get('Photo');
            let featureDesc = feature.get('Desc_');
            console.log(feature.get('Desc'));

            //let featureGeom = feature.get('photo');
            overlayLayer.setPosition(coordinate);
            overlayName.innerHTML = featureName;
            overlayArea.innerHTML = featureArea;
            overlayDesc.innerHTML = featureDesc;
            //overlayGeom.innerHTML = 'Feature Geometry : ' + featureGeom;
            //console.log(feature.getKeys());  //.getKeys()
        }
        }

    //layerSwitcher.renderPanel();
/*
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
            let featureName = feature.get('Name'); //.getKeys()
            let featureArea = feature.get('Photo');
            //let featureGeom = feature.get('photo');
            overlayLayer.setPosition(coordinate);
            overlayName.innerHTML = featureName;
            overlayArea.innerHTML = featureArea;
            //overlayGeom.innerHTML = 'Feature Geometry : ' + featureGeom;
            //console.log(feature.getKeys());  //.getKeys()
        })
    });

    map.on('click', function(e){
        console.log(e.coordinate);
    })
*/

map.on('click', function(evt){
    var geom = evt.coordinate;
})
}

