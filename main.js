window.onload = init

function init(){
    
    // default controls
    const fullScreen = new ol.control.FullScreen();
    const scaleLine = new ol.control.ScaleLine({
        unit:'degrees',
        minWidth:5,
        steps:4
    });
    const zoomSlider = new ol.control.ZoomSlider();
    const mousePosition = new ol.control.MousePosition({
        projection: 'EPSG:4326',
        coordinateFormat: function(coordinate) {
        return ol.coordinate.format(coordinate, '{y}, {x}', 4);
    }
    });
    const overviewMap = new ol.control.OverviewMap();

    var Osmlayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    var view = new ol.View({
        center:[8614756.729822244, 2611358.2528159544],
        zoom:3
    });

    var map = new ol.Map({
        target:'map',
        controls: ol.control.defaults().extend([
            fullScreen, scaleLine, zoomSlider, mousePosition, overviewMap
        ])
    });

    map.addLayer(Osmlayer);
    map.setView(view);



    //console.log(ol.control.defaults());
    /*
    var popupContainerElement = document.getElementById('popup-coordinate');

    const popupCoordinate = new ol.Overlay({
        element:popupContainerElement
    });

    map.addOverlay(popupCoordinate);

    map.on('click',function(b){
        const clickedCoordinate = b.coordinate;

        popupCoordinate.setPosition(undefined);
        popupCoordinate.setPosition(clickedCoordinate);
        popupContainerElement.innerHTML = clickedCoordinate;
        //popupContainerElement.innerHTML = Message1;
    });
    
    let DrawPoly = new ol.interaction.Draw({
        type:'Polygon',
        freehand:'Yes'
    })

    map.addInteraction(DrawPoly);

    /*
    DrawPoly.on('drawend', function(e){
        //console.log('End polyon drawing')
        let pareser = new ol.format.GeoJSON();
        let drawFeatures = pareser.writeFeatures([e.feature]);
        console.log(drawFeatures);

    })
    */

} 