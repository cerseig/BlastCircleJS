/*****************
*** AUDIO INIT ***
******************/
// class Audio {
//
//     window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;
//
//     var audioCtx = new AudioContext(),
//         audioBuffer,
//         audioSource,
//         analyser = audioCtx.createAnalyser(),
//         frequencyData = new Uint8Array(analyser.frequencyBinCount),
//         audio = new Audio();
//
//     audio.controls = true;
//     audio.src = "assets/sound/allnight.m4a";
//
// }


/*****************
*** SCENE INIT ***
******************/
var canvas = document.getElementById( 'myCanvas' ),
    ctx = canvas.getContext( '2d' );
    r = 0,
    circles = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvasWidth = canvas.width;
canvasHeight = canvas.height;

class Circle {
    constructor(r) {
        this.r = r;
    }
    draw() {
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = '#000';
        ctx.arc(canvasWidth/2, canvasHeight/2, this.r, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    }
    frame() {
        this.r += 1;
    }
}

function createCircle() {
    var circle = new Circle(0);
    circles.push(circle);
}

for (var i = 0; i < 100; i++) {
    setTimeout(function(){
        createCircle();
    }, 100+i*1000);
}

function update() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    requestAnimationFrame(update);
    for (var i = 0; i < circles.length; i++) {
        circles[i].frame();
        circles[i].draw();
    }
}

update();
