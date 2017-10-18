    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;

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

    var sound = new Audio('requiem.mp3');

    class Circle {
        constructor() {

        }
    }
    /**
      Time stuff
    */
    var DELTA_TIME = 0;
    var LAST_TIME = Date.now();

    /**
      Canvas stuff
    */
    var canvas
    var ctx

    var opts = {
      barWidth: 10
    }

    function initCanvas() {

      canvas = document.querySelector('canvas')
      ctx = canvas.getContext('2d')

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


      var barWidth = opts.barWidth;
      var margin = 2;
      var nbBars = canvasWidth / ( barWidth - margin );

      var cumul = 0;

      ctx.strokeStyle = getRandomColor()
      ctx.beginPath()

      for ( var i = 0; i < 20; i++ ) {

          // get the frequency according to current i
          let percentIdx = i;
          let frequencyIdx = Math.floor(1024 * percentIdx) //le buffer a 1024 valeurs,

          if (sound.frequencyData[frequencyIdx]) {

          }

        // ctx.rect( i * barWidth + ( i * margin ), canvasHeight - frequencyData[frequencyIdx] , barWidth, frequencyData[frequencyIdx] );
        ctx.arc(canvasWidth/2, canvasHeight/2, sound.frequencyData[frequencyIdx], 0, Math.PI*2)
        cumul += sound.frequencyData[frequencyIdx];

      }
      ctx.stroke()
      ctx.closePath()

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
