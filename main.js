window.onload = init

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center:[8741950.150446419, 2547900.8433118276],
            zoom : 2
            //minZoom:5,
            //maxZoom:8, //rotation:0.5
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target:'map',   // target to div element id;
        keyboardEventTarget:document
    })


const popupContanerCordinate = document.getElementById('popup-coordinator');

const popup = new ol.Overlay({
    element: popupContanerCordinate,
    positioning:'center-left'
})
map.addOverlay(popup);

map.on('click',function(e){
    //console.log(e.coordinate)
    const clickedCoordinate = e.coordinate;
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    popupContanerCordinate.innerHTML = clickedCoordinate
})


const dragRotate = new ol.interaction.DragRotate({
    condition:ol.events.condition.altKeyOnly
})
map.addInteraction(dragRotate);

}