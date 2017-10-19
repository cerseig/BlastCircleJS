var angle = 0,
lastCoord = [],
simplex = new SimplexNoise(),
value2d = 0,
time = 0,
frequence = 0,
x = 0,
y = 0;

class Audio {
    constructor(url) {
        window.AudioContext=window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
        this.audioCtx = new AudioContext()
        this.gainNode = this.audioCtx.createGain()
        this.audioBuffer
        this.audioSource
        this.analyser = this.audioCtx.createAnalyser()
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)
        this.request
        this.url = url //take url parameters
    }
    loadSound() {
      this.request = new XMLHttpRequest()
      this.request.open('GET', this.url, true)
      this.request.responseType = 'arraybuffer'

      // Decode asynchronously
      this.request.onload = function() {

        this.audioCtx.decodeAudioData(this.request.response, function( buffer ) {

          // success callback
          this.audioBuffer = buffer

          // Create sound from buffer
          this.audioSource = this.audioCtx.createBufferSource()
          this.audioSource.buffer = this.audioBuffer

          // connect the audio source to context's output
          this.audioSource.connect( this.analyser )
          this.analyser.connect( this.audioCtx.destination )

          this.play()

        }.bind( this ), function(){
            alert('Music not load')
        });
      }.bind( this )
      this.request.send()
    }

    play() {
        this.audioSource.start()
        this.audioSource.loop = true
    }

    pause() {
        this.audioSource.stop()
    }
}
class Pool {
    constructor( opts ) {
        this.entities = []
        this.activeEntities = []
        this.notActiveEntities = []
        this.klass = opts.klass
        this.nbEntities = opts.nbEntities
        this.allocate()
    }
    allocate() {
        for (var i = 0; i < this.nbEntities; i++) {
            var entity = new this.klass()
            entity.entityId = Math.random()
            this.entities.push( entity )
            this.notActiveEntities.push( entity )
        }
    }
    getEntity( params ) {

        var entity = this.notActiveEntities[0]
        this.notActiveEntities.shift()
        this.activeEntities.push( entity )
        entity.reset( params )

        return entity

    }
    releaseEntity(entity) {
        var index = this.activeEntities.indexOf( entity )
        this.activeEntities.splice(index, 1)
        this.notActiveEntities.push( entity )
    }
}
class Point {
  constructor (angle, ctx, frequence, radius) {
    this.angle = angle
    this.radius = radius
    this.ctx = ctx
    this.frequence = frequence
    this.x = Math.cos(this.angle) * (this.radius + value2d)
    this.y = Math.sin(this.angle) * (this.radius + value2d)
  }
  reset( params ) {
      this.angle = params.angle
      this.ctx = params.ctx
      this.frequence = params.frequence
      this.radius = params.radius
      this.x = params.x
      this.y = params.y
  }
  draw() {
    this.ctx.beginPath()
    this.ctx.save()
    this.ctx.globalAlpha = this.opacity
    this.ctx.translate(canvasWidth/2, canvasHeight/2)
    this.ctx.moveTo(lastCoord.x, lastCoord.y)
    this.ctx.lineTo(this.x, this.y)
    this.ctx.restore()
    this.ctx.closePath()
    this.ctx.stroke()


    lastCoord = {
      x: this.x,
      y: this.y
    }
  }
  update(radius) {
    time += 0.000025
    value2d = simplex.noise2D(Math.cos(this.angle) + time, Math.sin(this.angle) + time) * frequence
    this.x = Math.cos(this.angle) * (radius + value2d)
    this.y = Math.sin(this.angle) * (radius + value2d)
  }
}
class Circle {
    constructor(pool) {
        this.points = []
        this.radius = 0
        this.pool = pool
        this.color = getRandomColor()
        this.create()
    }

    create() {
        for (var i = 0; i < Math.PI*2 + 1; i+=0.05) {
          angle += 0.05; // augmenter du même angle pour un cercle parfait
          var point = this.pool.getEntity({
              angle: angle,
              ctx: ctx,
              frequence: frequence,
              radius: this.radius,
              x: Math.cos(angle) * (this.radius + value2d),
              y: Math.cos(angle) * (this.radius + value2d)
          }); // on créé un nouvel objet Point
          this.points.push(point); // on pousse dans le tableau Points, chaque point créé
        }
    }

    destroy() {
        for (var i = 0; i < this.points.length; i++) {
            this.pool.releaseEntity(this.points[i])
        }
    }

    draw() {
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].draw();
        }
        ctx.strokeStyle = this.color
        // link between first and last points of the circle
        ctx.moveTo(this.points[0].x, this.points[0].x)
        ctx.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y)
        ctx.closePath()
    }

    update() {
        this.radius += 2
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].update(this.radius);
        }
    }
}

/* App */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const audio = new Audio('./assets/sounds/fivehours.mp3')
const pool = new Pool({
    klass: Point,
    nbEntities: 1500
})
const color = [
  '#841e3e',
  '#b7263d',
  '#ed6342',
  '#f6c543'
]

var circles = []
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

function getRandom(min, max) {
    return Math.floor(Math.random() * max + min);
}

function getRandomColor() {
    var index = getRandom(0, color.length);
    return color[index];
}

/**
 * Resize function
 */
function resize() {
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.style.width = canvasWidth + 'px'
    canvas.style.height = canvasHeight + 'px'
}

/**
 * addListeners
 */
function addListeners() {
    /* Resize Listener */
    window.addEventListener('resize', resize, false);
    /* Audio control listener */
    window.onkeydown = function (e) {
        if(e.keyCode == 32) { audio.pause(); }
    }

}

function createCircle() {
    var circle = new Circle(pool)
    circles.push( circle )
}

// function doSomething() {}
//
// (function loop() {
//     var rand = Math.round(Math.random() * (3000 - 500)) + 500;
//     setTimeout(function() {
//             doSomething();
//             loop();
//     }, rand);
// }());

// function createCircles() {
//     var rand = getRandom(200, 1000);
//     setTimeout(function() {
//             createCircle();
//             createCircles();
//     }, rand);
//     // setTimeout(function() {
//     //     var circle = new Circle(pool)
//     //     circles.push( circle )
//     // }, 800 )
// }
var lastindex = 0
function render() {
    requestAnimationFrame( render )
    audio.analyser.getByteFrequencyData(audio.frequencyData);

    var cumul = 0;
    for ( var i = 0; i < 40; i++ ) {
      // get the frequency according to current i
      let percentIdx = i/40;
      let frequencyIdx = Math.floor(1024 * percentIdx) //le buffer a 1024 valeurs,

      cumul += audio.frequencyData[frequencyIdx] * 1.5;
      frequence = cumul/255

    }

    if (frequence > 1) {
        if (lastindex > 50) {
            createCircle()
            lastindex = 0
        } else {
            lastindex++
        }
    }

    for ( var i = 0; i < circles.length; i++ ) {
        var circle = circles[i]
        if (circle.radius > 500) {
            circle.destroy()
            circles.splice(i, 1)
        }
        circle.update()
        circle.draw()
        lastCoord = [];
    }

    ctx.fillStyle = 'rgba(80,29,67,0.3)'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.restore()
    ctx.closePath()
    ctx.stroke()
}

function init() {
    resize()
    addListeners()
    audio.loadSound()
    // createCircles()
    render()
}

/* And run ! :D */
init()
