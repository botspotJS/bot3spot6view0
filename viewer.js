const canvas = document.getElementById("viewer");
const ctx = canvas.getContext("2d");

const rows = {};
const rowNames = [];

const rowCount = 4;	  // Rows
const frames = 72;   // Images/ Row

let currentRow = 2;     //Initial start Row
let currentFrame = 0;	//Initial start Frame

let dragging = false;
let startX = 0;
let startY = 0;

let zoom = 1;
const zoomStep = 0.1;
const zoomMin = 0.5;
const zoomMax = 3;

let autoRotate = false;
let rotateSpeed = 50;    //Milliseconds / Frame


// Canvas Size

function resize(){

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

}

window.addEventListener("resize", resize);
resize();


// Load Pictures

function loadImages(){

    for(let r=1;r<=rowCount;r++){

        const ring = "Ring_" + String(r).padStart(2,"0");

        rows[ring] = [];
        rowNames.push(ring);

        for(let i=1;i<=frames;i++){

            const num = String(i).padStart(3,"0");

            const img = new Image();
            img.src = `cache/${ring}_${num}.png`;

            rows[ring].push(img);

        }

    }

}


// Rotate (Drag) Pictures

function draw(){

    const row = rows[rowNames[currentRow]];
    const img = row[currentFrame];

    if(!img.complete) return;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
		
// const scale = Math.min(
    // canvas.width / img.width,
    // canvas.height / img.height
// ) * zoom;
    );

    const w = img.width * scale;
    const h = img.height * scale;

    ctx.drawImage(
        img,
        canvas.width/2 - w/2,
        canvas.height/2 - h/2,
        w,
        h
    );

}


// Controlls

canvas.addEventListener("mousedown", e => {

    dragging = true;

    startX = e.clientX;
    startY = e.clientY;

});

window.addEventListener("mouseup", () => {

    dragging = false;

});

// Button.addEventListener("click", () => {

    // zoomin = true;

// });

window.addEventListener("mousemove", e => {

    if(!dragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // horizontal rotation
    if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8){

        const row = rows[rowNames[currentRow]];

        if(dx < 0)
            currentFrame = (currentFrame - 1 + row.length) % row.length;
        else
            currentFrame = (currentFrame + 1) % row.length;

        startX = e.clientX;

        draw();
    }

    // vertical rotation
    else if(Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 15){

        if(dy > 0)
            currentRow = Math.min(currentRow + 1, rowNames.length - 1);
        else
            currentRow = Math.max(currentRow - 1, 0);

        startY = e.clientY;

        draw();
    }

});


// Zoom in / out
function zoomIn(){

    zoom += 0.1;

    if(zoom > 3)
        zoom = 3;

    draw();

}

function zoomOut(){

    zoom -= 0.1;

    if(zoom < 0.5)
        zoom = 0.5;

    draw();

}

// auto rotate
function toggleAutoRotate(){

    autoRotate = !autoRotate;

    if(autoRotate){
        rotateLoop();
    }

}


function rotateLoop(){

    if(!autoRotate) return;

    const row = rows[rowNames[currentRow]];

    currentFrame = (currentFrame + 1) % row.length;

    draw();

    setTimeout(rotateLoop, rotateSpeed);

}


loadImages();

setTimeout(draw,300);