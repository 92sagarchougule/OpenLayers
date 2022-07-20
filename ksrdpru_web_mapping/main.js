window.onload = init

function init(){
    // main classes
    const map = new ol.Map({ // map class
        view: new ol.View({  // view class
            center:[8416598.169912841, 1731976.3818193525],
            zoom:16
        }),
        layers:[
            new ol.layer.Tile({  //layer class
                source: new ol.source.OSM(),
                title:'BaseMap'
            })
        ],
        target:'map'
    });

    /*
    //Added Layer from Geoserver
    
    
    //Contour Layer from Geoserver
    const contour = new ol.layer.Tile({
        source:new ol.source.TileWMS({
            url:'http://localhost:8080/geoserver/wms',
            params:{'LAYERS':'ksrdpru:contour.'},
            serverType:'geoserver'
        })
    });
    map.addLayer(contour);

    //Building Layer from Geoserver
    const Building = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'ksrdpru:buildings'},
            serverType: 'geoserver'
          })
    });
    map.addLayer(Building);
    */

    // GeoJSON layer added from local folder
    const Nursery = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:'./lib/spatial_data/lup_nursery.geojson',
            format: new ol.format.GeoJSON(),
            
        }),
        title:'Model_Nursery'
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

    /*const layerSwitcher = new ol.control.LayerSwitcher({
        activationMode: 'click',
        startActive: true,
        tipLabel: 'Layers', // Optional label for button
        groupSelectStyle: 'children', // Can be 'children' [default], 'group' or 'none'
        collapseTipLabel: 'Collapse layers',
    });
    map.addControl(layerSwitcher);*/

    




    /*
    map.on('click', function(e){
        console.log(e.coordinate);
    })
    */

}

