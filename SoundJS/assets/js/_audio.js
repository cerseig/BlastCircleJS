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
