

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Load the sudoku file
     */
    window.electronAPI.loadFileAsync();

    /**
     * Load the rest of the file
     */
    window.electronAPI.listenFileLoaded();
    window.electronAPI.onFileLoaded((sudoku) => {
        console.log('----> File loaded <---');        
        const map = L.map('map', {
            center: [0, 0],
            zoom: -144,
            crs: L.CRS.Simple
        });
    
        const bounds = [[0, 0], [1000, 1000]];
        const image = L.imageOverlay(sudoku, bounds).addTo(map);
        map.fitBounds(bounds);
    });

});
