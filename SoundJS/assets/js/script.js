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




    var sound = new Audio('./assets/sounds/photomaton.mp3')


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
        }
        getEntity( params ) {

            var entity = this.notActiveEntities[0]
            this.notActiveEntities.shift()
            this.activeEntities.push( entity )
            entity.reset( params )

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

    /*****************
    *** CIRCLE INIT **
    ******************/
    class Circle {
        constructor() {
            this.points = []
            this.radius = 0
            this.color = getRandomColor()


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
            if(this.radius > 410) {
                this.color = 'rgba(0,0,0,0.9)'
            }
            if(this.radius > 420) {
                this.color = 'rgba(0,0,0,0.8)'
            }
            if(this.radius > 430) {
                this.color = 'rgba(0,0,0,0.7)'
            }
            if(this.radius > 440) {
                this.color = 'rgba(0,0,0,0.6)'
            }
            if(this.radius > 450) {
                this.color = 'rgba(0,0,0,0.5)'
            }
            if(this.radius > 460) {
                this.color = 'rgba(0,0,0,0.4)'
            }
            if(this.radius > 470) {
                this.color = 'rgba(0,0,0,0.3)'
            }
            if(this.radius > 480) {
                this.color = 'rgba(0,0,0,0.2)'
            }
            if(this.radius > 490) {
                this.color = 'rgba(0,0,0,0.1)'
            }
            if(this.radius > 500) {
                this.color = 'rgba(0,0,0,0)'
            }
            this.radius += 2
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].update(this.radius);
            }
        }
    }

    var pool = new Pool({
        klass: Point,
        nbEntities: 10000
    })



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
        window.onkeydown = function (e) {
            var keyCode = e.keyCode;
            if(keyCode == 32) {
                sound.pause();
            }
        };

    }

    /**
     * update
     */
    function frame() {

      rafId = requestAnimationFrame( frame )

      DELTA_TIME = Date.now() - LAST_TIME;
      LAST_TIME = Date.now();
      sound.analyser.getByteFrequencyData(sound.frequencyData);

      var cumul = 0;
      for ( var i = 0; i < 40; i++ ) {
          // get the frequency according to current i
          let percentIdx = i/40;
          let frequencyIdx = Math.floor(1024 * percentIdx) //le buffer a 1024 valeurs,

        cumul += sound.frequencyData[frequencyIdx];

        frequence = cumul/255
      }

      for ( var i = 0; i < circles.length; i++ ) {
          var circle = circles[i]
          circle.update()
          circle.draw()
          lastCoord = [];
      }

      ctx.fillStyle = 'rgba(80,29,67,0.4)'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      ctx.beginPath()
      ctx.lineWidth = 3
      ctx.restore()
      ctx.closePath()
      ctx.stroke()
    }


    setInterval( function() {
        var circle = new Circle()
        circles.push( circle )
    }, 700)

    /**
     * onResize
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
