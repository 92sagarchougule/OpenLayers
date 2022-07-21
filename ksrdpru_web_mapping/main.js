window.onload = init

function init(){
    // main classes
    const map = new ol.Map({ // map class
        view: new ol.View({  // view class
            //projection:'EPSG:4326',
            center:[8416598.169912841, 1731976.3818193525],
            zoom:15
        }),
        layers:[
            new ol.layer.Tile({  //layer class
                source: new ol.source.OSM(),
                title:'BaseMap',
                type:'base',
                visible:true
            })
        ],
        target:'map'
    });

    
    //Added Layer from Geoserver
    
    
    //Contour Layer from Geoserver

    const contour = new ol.layer.Tile({
        source:new ol.source.TileWMS({
            url:'http://localhost:8080/geoserver/wms',
            params:{'LAYERS':'ksrdpru:contour.'},
            serverType:'geoserver'
        }),
        title:'Contour'
    });
    map.addLayer(contour);
    /**/

    const Boundry = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'ksrdpru:lineboundry'},
            serverType: 'geoserver'
          }),
          title:'Boundry'
    });
    map.addLayer(Boundry);




    //Building Layer from Geoserver
    const Building = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'ksrdpru:buildings'},
            serverType: 'geoserver'
          }),
          title:'Building'
    });
    map.addLayer(Building);
    

    // GeoJSON layer added from local folder
    const Nursery = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'./lib/spatial_data/lup_nursery.geojson',
            format: new ol.format.GeoJSON(),
            
        }),
        title:'Model Nursery'
    });

    map.addLayer(Nursery);


    

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
        startActive:false,
        groupSelectStyle:'children',
        collapseTipLabel: 'Collapse layers'
    })
    map.addControl(layerSwitcher);

    /*

    var builPhoto = new ol.layer.Vector({
        title:'Buildings',
        source: new ol.source.Vector({
            url:'./lib/spatial_data/Buildings.geojson',
            format: new ol.format.GeoJSON()
        })
    });

    map.addLayer(builPhoto);

    */

    /*const layerSwitcher = new ol.control.LayerSwitcher({
        activationMode: 'click',
        startActive: true,
        tipLabel: 'Layers', // Optional label for button
        groupSelectStyle: 'children', // Can be 'children' [default], 'group' or 'none'
        collapseTipLabel: 'Collapse layers',
    });
    map.addControl(layerSwitcher);*/

    

    var Style  = new ol.style.Style({

        image: new ol.style.Circle({
            radius:7,
            fill: new ol.style.Fill({
                color:'#3399CC'
            })
        })
    });

    var stylePic = new ol.style.Style({
        image: new ol.style.Icon({
            anchor:[0.1,0.1],
            anchorXUnits:'fraction',
            anchorYUnits:'pixels',
            src:'./lib/spatial_data/Photos/Location.jpg'
        })
    })

    /*
    map.on('click', function(e){
        console.log(e.coordinate);
    })
    */
  
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

    var marklayer = new ol.layer.Vector({
        title:'Location',
        source: new ol.source.Vector({
            features:[marker, marker1, marker2, marker3]
        }),
        style: function(feature, resolution){
            return getStyle(feature, resolution);
        }
    });

    getStyle = function(feature, resolution){
        if(feature.get('type') == 'Sabarmati'){
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor:[0.5, 10],
                    anchorXUnits:'fraction',
                    anchorYUnits:'pixels',
                    src:'./lib/spatial_data/Photos/Location1.jpg',
                })
            })
        }


        else if(feature.get('type') == 'Quarters'){
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor:[0.5, 10],
                    anchorXUnits:'fraction',
                    anchorYUnits:'pixels',
                    src:'./lib/spatial_data/Photos/Location.jpg',
                })
            })
        }

        else {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor:[0.5, 10],
                    anchorXUnits:'fraction',
                    anchorYUnits:'pixels',
                    src:'./lib/spatial_data/Photos/Location.jpg',
                })
            })
        }
    }

    map.addLayer(marklayer);
    
/*
    highlightStyle  = new ol.style.Style({
        fill: new ol.style.Fill({
            color:'rgba(255,255,255,0.4)',
        }),
        stroke: new ol.style.Strock({
            color:'#3399CC',
            width:3,
        }),
        image: new ol.style.Circle({
            radius:10,
            fill: new ol.style.Fill({
                color:'#3399CC'
            })
        })
    });
    */
    /*
    map.on('click', function(e){
        console.log(e.coordinate);
    })
    */

}

