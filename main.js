window.onload = init

function init(){
    

    var Osmlayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    var view = new ol.View({
        center:[8614756.729822244, 2611358.2528159544],
        zoom:3
    });

    var map = new ol.Map({
        target:'map'
    });

    map.addLayer(Osmlayer);
    map.setView(view);

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
    })
} 