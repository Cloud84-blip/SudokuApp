const load = async()=>{
    const sudokuPath = await window.electronAPI.loadFileAsync();
    if (sudokuPath) {
        console.log('----> File loaded <---');
        const map = L.map('map', {
            center: [0, 0],
            zoom: -144,
            crs: L.CRS.Simple
        });
    
        const bounds = [[0, 0], [1000, 1000]];
        const image = L.imageOverlay(sudokuPath, bounds).addTo(map);
        map.fitBounds(bounds);

        map.on('click', function (e) {
            const currentZoom = map.getZoom();
            const newZoom = currentZoom + 1;
            if (newZoom <= map.getMaxZoom()) {
                map.setView(e.latlng, newZoom);
            }
        });
    } else {
        console.log('No file selected or image generation failed.');
    }
}

document.getElementById("loadFile").addEventListener('click', ()=>{
    load();
});


