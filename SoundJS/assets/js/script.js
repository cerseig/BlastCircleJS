    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');

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

    var sound = new Audio('./assets/sounds/roses.mp3');

    var angle = 0,
    points = [],
    lastCoord = [],
    simplex = new SimplexNoise(),
    value2d = 0,
    time = 0,
    frequence = 0,
    x = 0,
    y = 0;

    class Point {
      constructor (angle, ctx, frequence) {
        this.angle = angle
        this.radius = 200
        this.ctx = ctx
        this.frequence = frequence
        this.x = Math.cos(this.angle) * (this.radius + value2d)
        this.y = Math.sin(this.angle) * (this.radius + value2d)
      }
      draw() {
        this.ctx.beginPath();
        this.ctx.save();

        this.ctx.strokeStyle = getRandomColor()

        this.ctx.translate(canvasWidth/2, canvasHeight/2);
        // this.ctx.arc(this.x, this.y, 2, 0, Math.PI*2);
        this.ctx.moveTo(lastCoord.x, lastCoord.y);
        this.ctx.lineTo(this.x, this.y);

        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.restore();
        this.ctx.closePath();

        lastCoord = {
          x: this.x,
          y: this.y
        }
      }
      frame() {
        time += 0.000025;
        value2d = simplex.noise2D(Math.cos(this.angle) + time, Math.sin(this.angle) + time) * (frequence);
        this.x = Math.cos(this.angle) * (this.radius + value2d);
        this.y = Math.sin(this.angle) * (this.radius + value2d);
      }
    }

    // update()
    //
    // function update() {
    //   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //   requestAnimationFrame( update );
    //   for (var i = 0; i < points.length; i++) {
    //     points[i].frame();
    //     points[i].draw();
    //   }
    // }

    // for (var i = 0; i <Math.PI*2; i+=0.05) {
    //   angle += 0.05; // augmenter du même angle pour un cercle parfait
    //   var point = new Point(angle, ctx); // on créé un nouvel objet Point
    //   point.draw()
    //   points.push(point); // on pousse dans le tableau Points, chaque point créé
    // }

    /**
      Time stuff
    */
    var DELTA_TIME = 0;
    var LAST_TIME = Date.now();

    var opts = {
      barWidth: 10
    }

    function initCanvas() {
      onResize()
    }

    /**
     * addListeners
     */
    function addListeners() {

      window.addEventListener( 'resize', onResize.bind(this) );
      rafId = requestAnimationFrame( frame )

    }

    /**
     * update
     * - Triggered on every TweenMax tick
     */
    function frame() {
      rafId = requestAnimationFrame( frame )

      DELTA_TIME = Date.now() - LAST_TIME;
      LAST_TIME = Date.now();

      // analyser.getByteFrequencyData(frequencyData);

      sound.analyser.getByteFrequencyData(sound.frequencyData);
      ctx.clearRect( 0, 0, canvasWidth, canvasHeight )

      for (var i = 0; i < points.length; i++) {
          points[i].frame();
          points[i].draw();
      }

      var barWidth = opts.barWidth;
      var margin = 2;
      var nbBars = canvasWidth / ( barWidth - margin );
      var cumul = 0;

      ctx.beginPath()

      for ( var i = 0; i < 50; i++ ) {

          // get the frequency according to current i
          let percentIdx = i/50;
          let frequencyIdx = Math.floor(1024 * percentIdx) //le buffer a 1024 valeurs,


        // ctx.rect( i * barWidth + ( i * margin ), canvasHeight - frequencyData[frequencyIdx] , barWidth, frequencyData[frequencyIdx] );
        // ctx.arc(canvasWidth/2, canvasHeight/2, sound.frequencyData[frequencyIdx], 0, Math.PI*2)
        cumul += sound.frequencyData[frequencyIdx];

        frequence = cumul/255


      }
      ctx.stroke()
      ctx.closePath()

    }


    for (var i = 0; i <Math.PI*2; i+=0.05) {
      angle += 0.05; // augmenter du même angle pour un cercle parfait
      var point = new Point(angle, ctx, this.frequence); // on créé un nouvel objet Point
      points.push(point); // on pousse dans le tableau Points, chaque point créé
    }


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
