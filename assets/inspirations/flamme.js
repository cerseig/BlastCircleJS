/********************
*   CLASS AUDIO
***********************/

class Audio {
  constructor( url ){
    this.audioCtx = new AudioContext()
    this.audioBuffer
    this.audioSource
    this.analyser = this.audioCtx.createAnalyser()
    this.frequencyData = new Uint8Array( this.analyser.frequencyBinCount )
    this.request
    this.url = url
  }

  loadSound() {
    this.request = new XMLHttpRequest()
    this.request.open( 'GET', this.url , true )
    this.request.responseType = 'arraybuffer'

    // Decode asynchronously
    this.request.onload = function() {

      this.audioCtx.decodeAudioData( this.request.response, function( buffer ) {

        // success callback
        this.audioBuffer = buffer

        // Create sound from buffer
        this.audioSource = this.audioCtx.createBufferSource()
        this.audioSource.buffer = this.audioBuffer

        // connect the audio source to context's output
        this.audioSource.connect( this.analyser )
        this.analyser.connect( this.audioCtx.destination )

        // play sound
        this.audioSource.start()
        this.audioSource.loop = true

      }.bind( this ), function(){
        alert( 'sound not loaded' )
      })
    }.bind( this )
    this.request.send()
  }
}


/********************
*   CLASS PARTICLE
***********************/

class Particle {
  constructor( ctx, canvas, compteur, opts ){
    this.ctx = ctx
    this.canvas = canvas
    this.compteur = compteur

    this.height = opts.height
    this.width = opts.width
    this.scale = 1

    this.opacity = 0
    this.initialOpacity = opts.opacity

    this.position = []
    this.position[0] = opts.position.x || 0
    this.position[1] = opts.position.y || 0
    this.initialPosition = opts.position.y || 0

    this.velocity = opts.velocity.y || 0
  }

  update( volumeTotalMoyen, highFrequenciesMoyenne ) {

    // define the rapidity of the particles movment
    if (volumeTotalMoyen > 0) {
      this.position[1] -= this.velocity * volumeTotalMoyen / 6
    } else {
      this.position[1] -= this.velocity
    }

    // define the scale which will make particles biger
    this.scale = highFrequenciesMoyenne / 35

    // update opacity when particles arrive and quit the scene AND never set a value up of the initialOpacity setted at the creation
    if ( this.position[1] > canvas.height / 3 && this.opacity < this.initialOpacity ) {
      this.opacity += 0.015
    }
    if ( this.position[1] < canvas.height / 3 && this.opacity > 0.05 ) {
      this.opacity -= 0.05
    }
    if ( this.position[1] < canvas.height / 6 ) {
      this.position[1] = this.initialPosition
      this.opacity = 0
    }

  }

  draw() {
    var ctx = this.ctx
    ctx.beginPath()
    ctx.save()
    ctx.translate( this.position[0], this.position[1] )
    ctx.moveTo ( 0, 0 )
    ctx.lineTo ( 0, -this.height )
    ctx.lineCap = 'round'
    ctx.globalAlpha = this.opacity

    // scale the lineWidth only for the yellow and light orange particles
    if ( this.compteur % 3 != 0 ) {
      ctx.strokeStyle = "#FF5733"
      ctx.lineWidth = this.width
    } else if ( this.compteur % 6 != 0 ) {
      ctx.strokeStyle = "#FDA101"
      ctx.lineWidth = this.width * this.scale
    } else {
      ctx.strokeStyle = "#FF913A"
      ctx.lineWidth = this.width * this.scale
    }

    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
}


/********************
*   CLASS FLAME
***********************/

class Flame {
  constructor( ctx, canvas, compteur, opts ) {
    this.ctx = ctx
    this.canvas = canvas
    this.compteur = compteur

    this.maxMove = opts.maxMove
    this.move = 0

    this.opacity = opts.opacity
    this.initialOpacity = opts.opacity

    if ( this.compteur % 3 != 0) {
      this.go = true
      this.back = false
    } else {
      this.go = false
      this.back = true
    }

    this.position = []
    this.position[0] = opts.position.x || 0
    this.position[1] = opts.position.y || 0

    this.velocity = opts.velocity.x || 0
  }

  update( highFrequenciesMoyenne ) {

    // update opacity and position y of the flames when there is a lot of highFrequencies, and return to their initial statments after
    if ( highFrequenciesMoyenne > 105 ) {
      this.opacity += 0.01
      this.position[1] -= 0.8
    } else if ( this.opacity > this.initialOpacity ) {
      this.opacity -= 0.01
      this.position[1] += 0.8
    }

    // update boleans to allow movement "backward" or movement "forward"
    if ( this.move > this.maxMove ) {
      this.back = true
      this.go = false
    } else if ( this.move < -this.maxMove ) {
      this.back = false
      this.go = true
    }

    // update position x of a flame in function of its respective velocity, of its actual move allowed, and of its respective maxMove
    if ( this.move > -this.maxMove && this.back ) {
      this.position[0] -= this.velocity
      this.move -= this.velocity
    } else if ( this.move < this.maxMove && this.go ) {
      this.position[0] += this.velocity
      this.move += this.velocity
    }
  }

  draw() {
    var ctx = this.ctx
    ctx.beginPath()
    ctx.save()
    ctx.translate( this.position[0], this.position[1] )
    ctx.moveTo( -150, 150 )
    ctx.lineTo( 0, -400 )
    ctx.lineTo( 150, 150 )
    ctx.globalAlpha = this.opacity

    // set different colors
    if ( this.compteur % 3 != 0 ) {
      ctx.fillStyle = "#FF913A"
      ctx.fill()
    } else if ( this.compteur % 6 != 0 ) {
      ctx.fillStyle = "#FF5733"
      ctx.fill()
    } else {
      ctx.strokeStyle = "#FFC300"
      ctx.stroke()
    }

    ctx.closePath()
    ctx.restore()
  }
}



/********************
*   MAIN SCRIPT
***********************/

/****
* SCENE SETUP
***/
var canvas = document.getElementById( 'canvas' ),
    ctx = canvas.getContext( '2d' ),
    particles = [],
    flames = [],
    compteurParticles = 0,
    compteurFlames = 0
canvas.width = window.innerWidth
canvas.height = window.innerHeight


/****
* AUDIO SETUP
***/
var sound1 = new Audio( 'http://guyonmelina.fr/pens/feu.mp3' ),
    sound2 = new Audio( 'http://guyonmelina.fr/pens/musique.mp3' )


initAudio()
initCanvas()


/****
* CANVAS DRAWING
***/
function initCanvas() {
  for ( var i = 0; i < 80; i++ ) {
    createParticles()
  }
  for ( var i = 0; i < 45; i++ ) {
    createFlames()
  }
  startAmimation()
}

// create a new particle with random parameters deifne by a minimum and a maximum
function createParticles() {
  var particle = new Particle( ctx, canvas, compteurParticles, {
    position : {
      x : Math.random() * ( canvas.width / 1.2 - canvas.width / 4 ) + canvas.width / 4,
      y : Math.random() * ( canvas.height / 0.8 - canvas.height / 1.3 ) + canvas.height / 1.3
    },
    velocity : {
      y : Math.random() * ( 1.5 - 0.5 ) + 0.5
    },
    opacity : Math.random() * ( 1 - 0.3 ) + 0.3,
    height :  Math.random() * ( 70 - 20 ) + 20,
    width :  Math.random() * ( 20 - 10 ) + 10
  } )
  particles.push( particle )
  compteurParticles += 1
}

// create a new flame with random parameters deifne by a minimum and a maximum
function createFlames() {
  var flame = new Flame( ctx, canvas, compteurFlames, {
    position : {
      x : Math.random() * ( canvas.width / 1.2 - canvas.width / 5 ) + canvas.width / 5,
      y : Math.random() * ( canvas.height / 0.70 - canvas.height / 0.80 ) + canvas.height / 0.80
    },
    velocity : {
      x : Math.random() * ( 0.6 - 0.2 ) + 0.2
    },
    opacity : Math.random() * ( 1 - 0.4 ) + 0.4,
    maxMove : Math.random() * ( 20 - 5 ) + 5
  } )
  flames.push( flame )
  compteurFlames += 1
}

function startAmimation() {
  ctx.clearRect( 0, 0, canvas.width, canvas.height )
  sound2.analyser.getByteFrequencyData( sound2.frequencyData )

  // get datas from the treaments of the song to pass them to canvas elements and make them react with
  var volumeTotalMoyen = getVolumeTotalMoyen()
  var highFrequenciesMoyenne = getHighFrequencies()


  for ( var i = 0; i < particles.length; i++ ) {
    particles[i].update( volumeTotalMoyen, highFrequenciesMoyenne )
    particles[i].draw()
  }
  for ( var i = 0; i < flames.length; i++ ) {
    flames[i].update( highFrequenciesMoyenne )
    flames[i].draw()
  }
  requestAnimationFrame( startAmimation )
}

// resize canvas
window.onresize = function() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  for ( var i = 0; i < particles.length; i++ ) {
    particles[i].position[0] = Math.random() * ( canvas.width / 1.2 - canvas.width / 4 ) + canvas.width / 4
    particles[i].position[1] = Math.random() * ( canvas.height / 0.8 - canvas.height / 1.3 ) + canvas.height / 1.3
  }
  for ( var i = 0; i < flames.length; i++ ) {
    flames[i].position[0] = Math.random() * ( canvas.width / 1.2 - canvas.width / 5 ) + canvas.width / 5
    flames[i].position[1] = Math.random() * ( canvas.height / 0.70 - canvas.height / 0.80 ) + canvas.height / 0.80
  }
}


/****
* AUDIO LOADING AND TREATMENTS
***/
function initAudio() {
  sound1.loadSound()
  sound2.loadSound()
}

// get all the 1024 entries of the table and make the average number
function getVolumeTotalMoyen() {
  var volumeTotal = 0
  for ( var i = 0; i < sound2.frequencyData.length; i++ ) {
    volumeTotal += sound2.frequencyData[i]
  }
  var volumeTotalMoyen = volumeTotal / sound2.frequencyData.length
  return volumeTotalMoyen
}

// get only the 600 firsts entries of the table and make the average number
function getHighFrequencies() {
  var highFrequencies = 0
  for ( var i = 0; i < 600; i++ ) {
    highFrequencies += sound2.frequencyData[i]
  }
  var highFrequenciesMoyenne = highFrequencies / 600
  return highFrequenciesMoyenne
}
