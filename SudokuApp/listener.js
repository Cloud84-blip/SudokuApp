document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const content = document.getElementById('pan-view');
    content.zoom = 1;
});

// const grid = document.getElementById("container");

// document.addEventListener('wheel', (event) => {
//     if (event.ctrlKey) {
//         event.preventDefault();

//         const scaleAmount = 0.1;
//         const content = document.getElementById('sudoku-grid');
//         let transform = content.style.transform;
//         let scaleMatch = transform.match(/scale\(([^)]+)\)/);
//         let translateMatch = transform.match(/translate\(([^)]+)\)/);

//         let scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
//         let translateX = translateMatch ? parseFloat(translateMatch[1].split(',')[0]) : 0;
//         let translateY = translateMatch ? parseFloat(translateMatch[1].split(',')[1]) : 0;

//         if (event.deltaY < 0) {
//             scale += scaleAmount;
//         } else {
//             scale -= scaleAmount;
//         }
//         scale = Math.max(0.1, Math.min(scale, 10));

//         const rect = content.getBoundingClientRect();
//         const x = event.clientX - rect.left;
//         const y = event.clientY - rect.top;

//         const deltaX = x * (scale - 1) / scale;
//         const deltaY = y * (scale - 1) / scale;

//         translateX -= deltaX;
//         translateY -= deltaY;

//         content.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
//     }
// });

// document.addEventListener('keydown', (event) => {
//     if (event.code === 'Space') {
//         console.log("SPACE")
//         event.preventDefault();
//         document.body.style.cursor = 'grab';
//     }
// });

// document.addEventListener('keyup', (event) => {
//     if (event.code === 'Space') {
//         document.body.style.cursor = '';
//     }
// });

// let panning = false;
// let panStartX = 0;
// let panStartY = 0;

// document.addEventListener('mousedown', (event) => {
//     if (document.body.style.cursor === 'grab') {
//         panning = true;
//         panStartX = event.clientX;
//         panStartY = event.clientY;
//         document.body.style.cursor = 'grabbing';
//         event.target.style.cursor = 'grabbing';
//     }
// });

// document.addEventListener('mousemove', (event) => {
//     if (panning) {
//         const dx = event.clientX - panStartX;
//         const dy = event.clientY - panStartY;
//         document.getElementById('grid-container').scrollBy(-dx, -dy);
//         panStartX = event.clientX;
//         panStartY = event.clientY;
//     }
// });

// document.addEventListener('mouseup', (event) => {
//     if (panning) {
//         document.body.style.cursor = 'grab';
//         panning = false;
//     }
// });


// Add a button to reset the zoom
// const resetButton = document.createElement('button');
// resetButton.innerText = 'Reset Zoom';
// resetButton.classList.add('button');
// resetButton.addEventListener('click', () => {
//     const gridElement = document.getElementById('sudoku-grid');
//     gridElement.style.transform = 'scale(0.3) translate(0, 15vh)';
//     document.getElementById('grid-container').scrollTo({top: 0, left:0, behavior: 'smooth'});
//     // document.getElementById('sudoku-grid').scrollTo({top: 0, left:0, behavior: 'smooth'});
//     // document.getElementById('sudoku-grid').style.transform = 'scale(0.3) translate(0, 160px)';
//     window.scrollTo({top: 0, behavior: 'smooth'});
// });
// document.getElementById('button-container').appendChild(resetButton);