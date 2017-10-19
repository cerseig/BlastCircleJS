    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');

    var circles = []

    const color = [
      '#841e3e',
      '#b7263d',
      '#ed6342',
      '#f6c543'
    ]

    function getRandom(min, max) {
      return Math.floor(Math.random() * max + min);
    }

    function getRandomColor() {
      const index = getRandom(0, color.length);
      return color[index];
    }

    /*****************
    *** AUDIO INIT ***
    ******************/
    class Audio {
        constructor(url) {
            window.AudioContext=window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
            this.audioCtx = new AudioContext()
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

              // play sound
              this.audioSource.start()
              // repeat sound
              this.audioSource.loop = true

              addListeners()
              frame()

            }.bind( this ), function(){
                alert('Music not load')
            });
          }.bind( this )
          this.request.send()
        }
    }

    var sound = new Audio('./assets/sounds/boumtam.mp3')

console.log('TEST');

    /*****************
    *** POINT INIT ***
    ******************/
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
            // canvasWidth.log('not active ->', this.notActiveEntities);
        }
        getEntity( params ) {

            var entity = this.notActiveEntities[0]
            this.notActiveEntities.shift()
            this.activeEntities.push( entity )
            entity.reset( params )

            // canvasWidth.log('not active ->', this.notActiveEntities);
            return entity

        }
        releaseEntity() {
            var index = this.activeEntities.indexOf( entity )

            this.activeEntities.splice(index, 1)
            this.notActiveEntities.push( entity )
        }
    }

    var angle = 0,
    lastCoord = [],
    simplex = new SimplexNoise(),
    value2d = 0,
    time = 0,
    frequence = 0,
    x = 0,
    y = 0;

    /*****************
    *** POINT INIT ***
    ******************/
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
        this.ctx.translate(canvasWidth/2, canvasHeight/2)
        this.ctx.moveTo(lastCoord.x, lastCoord.y)
        this.ctx.lineTo(this.x, this.y)
        // this.ctx.moveTo(this.points[0].x, this.points[0].y)
        // this.ctx.lineTo(this.points[125].x, this.points[125].y)
        this.ctx.restore()
        this.ctx.closePath()
        this.ctx.stroke()

        // canvasWidth.log(lastCoord.x);

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
    /*****************
    *** CIRCLE INIT **
    ******************/
    class Circle {
        constructor() {
            this.points = []
            this.radius = 0

            for (var i = 0; i < Math.PI*2 + 1; i+=0.05) {
              angle += 0.05; // augmenter du même angle pour un cercle parfait
              var point = pool.getEntity({
                  angle: angle,
                  ctx: ctx,
                  frequence: frequence,
                  radius: this.radius,
                  x: Math.cos(angle) * (this.radius + value2d),
                  y: Math.cos(angle) * (this.radius + value2d)
              }); // on créé un nouvel objet Point
              this.points.push(point); // on pousse dans le tableau Points, chaque point créé
            //   console.log(point.x);
            }

            // ctx.moveTo(this.points[0].x, this.points[0].y)
            // ctx.lineTo(this.points[125].x, this.points[125].y)
            // ctx.closePath()
            // ctx.stroke()

            // console.log(this.radius);

            // console.log(this.points[0]);
            // let test = this.points[0];
            // console.log(test.angle);
            // console.log(this.points[0]['x']);


        }
        draw() {
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].draw();

            }

            console.log(this.points[this.points.length - 1]);
            ctx.moveTo(this.points[0].x, this.points[0].x)
            ctx.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y)
            //ctx.stroke()
            ctx.closePath()
            // console.log(this.points[125].x);
        }
        update() {
            this.radius += 0.5
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].update(this.radius);
            }



            // console.log(this.points[0].x);
            // console.log(this.points[125].x);

            // ctx.moveTo(this.points[125].x, this.points[125].y)
            // ctx.lineTo(this.points[0].x, this.points[0].y)
            // ctx.stroke()
        }
    }

    var pool = new Pool({
        klass: Point,
        nbEntities: 1890
    })
    var circle = new Circle()
    circles.push( circle )


    /**
      Time stuff
    */
    var DELTA_TIME = 0;
    var LAST_TIME = Date.now();


    function initCanvas() {
      onResize()
    }

    /**
     * addListeners
     */
    function addListeners() {

      window.addEventListener( 'resize', onResize.bind(this) );
    //   rafId = requestAnimationFrame( frame )

    }

    /**
     * update
     * - Triggered on every TweenMax tick
     */
    function frame() {

      rafId = requestAnimationFrame( frame )

      DELTA_TIME = Date.now() - LAST_TIME;
      LAST_TIME = Date.now();
      sound.analyser.getByteFrequencyData(sound.frequencyData);


    //   var firstItem = this.points[0];
    //   var lastItem = this.points[this.points.length - 1];

      for ( var i = 0; i < circles.length; i++ ) {
          var circle = circles[i]
          circle.update()
          circle.draw()

          ctx.strokeStyle = getRandomColor()

          lastCoord = [];
      }
      ctx.fillStyle = 'rgba(80,29,67,0.3)'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      var cumul = 0;

      ctx.beginPath()
      ctx.lineWidth = 5

      for ( var i = 0; i < 20; i++ ) {
          // get the frequency according to current i
          let percentIdx = i/100;
          let frequencyIdx = Math.floor(1024 * percentIdx) //le buffer a 1024 valeurs,

        cumul += sound.frequencyData[frequencyIdx];
        frequence = cumul/255

      }
      ctx.restore()
      ctx.closePath()
      ctx.stroke()

    }

    setInterval( function() {

        var circle = new Circle()
        circles.push( circle )


    }, 5000)


    /**
     * onResize
     * - Triggered when window is resized
     * @param  {obj} evt
     */
    function onResize( evt ) {

      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      canvas.style.width = canvasWidth + 'px'
      canvas.style.height = canvasHeight + 'px'
    }

    initCanvas()
    sound.loadSound()
