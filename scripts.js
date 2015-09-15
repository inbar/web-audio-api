var _audioContext;
var _oscillator;
var _gainNode;



var SynthPad = (function() {
  // Variables
  var myCanvas;
  var frequencyLabel;
  var volumeLabel;

  var myAudioContext;
  var oscillator;
  var gainNode;


  // Notes
  var lowNote = 261.63; // C4
  var highNote = 493.88; // B4
 


  // Constructor
  var SynthPad = function() {
    myCanvas = document.getElementById('synth-pad');
    frequencyLabel = document.getElementById('frequency');
    volumeLabel = document.getElementById('volume');
  
    // Create an audio context.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    myAudioContext = new window.AudioContext();
  
    SynthPad.setupEventListeners();
  };
  
  
  // Event Listeners
  SynthPad.setupEventListeners = function() {
  
    // Disables scrolling on touch devices.
    document.body.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, false);
  
    myCanvas.addEventListener('mousedown', SynthPad.playSound);
    myCanvas.addEventListener('touchstart', SynthPad.playSound);
  
    myCanvas.addEventListener('mouseup', SynthPad.stopSound);
    document.addEventListener('mouseleave', SynthPad.stopSound);
    myCanvas.addEventListener('touchend', SynthPad.stopSound);
  };
  
  
  // Play a note.
  SynthPad.playSound = function(event) {
    if (_oscillator) {
      _oscillator.stop(0);
    }

    oscillator = myAudioContext.createOscillator();
    gainNode = myAudioContext.createGain();
  
    oscillator.type = 'triangle';
  
    gainNode.connect(myAudioContext.destination);
    oscillator.connect(gainNode);
  
    SynthPad.updateFrequency(event);
  
    oscillator.start(0);
  
    myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
    myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);
  
    myCanvas.addEventListener('mouseout', SynthPad.stopSound);
  };
  
  // Stop the audio.
  SynthPad.stopSound = function(event) {
    if (oscillator) {
      oscillator.stop(0);
    }
      
    myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
    myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);
    myCanvas.removeEventListener('mouseout', SynthPad.stopSound);
  };
   
  
  // Calculate the note frequency.
  SynthPad.calculateNote = function(posX) {
    var noteDifference = highNote - lowNote;
    var noteOffset = (noteDifference / myCanvas.offsetWidth) * (posX - myCanvas.offsetLeft);
    return lowNote + noteOffset;
  };
  
  
  // Calculate the volume.
  SynthPad.calculateVolume = function(posY) {
    var volumeLevel = 1 - (((100 / myCanvas.offsetHeight) * (posY - myCanvas.offsetTop)) / 100);
    return volumeLevel;
  };
  
  
  // Fetch the new frequency and volume.
  SynthPad.calculateFrequency = function(x, y) {
    var noteValue = SynthPad.calculateNote(x);
    var volumeValue = SynthPad.calculateVolume(y);
  
    oscillator.frequency.value = noteValue;
    gainNode.gain.value = volumeValue;
  
    frequencyLabel.innerHTML = Math.floor(noteValue) + ' Hz';
    volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';
  };
  
  
  // Update the note frequency.
  SynthPad.updateFrequency = function(event) {
    if (event.type == 'mousedown' || event.type == 'mousemove') {
      SynthPad.calculateFrequency(event.x, event.y);
    } else if (event.type == 'touchstart' || event.type == 'touchmove') {
      var touch = event.touches[0];
      SynthPad.calculateFrequency(touch.pageX, touch.pageY);
    }
  };
  
  SynthPad.setParams = function(event) {
  
  };

  
  // Export SynthPad.
  return SynthPad;
})();


// Initialize the page.
window.onload = function() {
  var synthPad = new SynthPad();
  initOsc();
}

function initOsc() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  _audioContext = new window.AudioContext();
}

function play() {
  if (_oscillator) {
    _oscillator.stop(0);
  }
  _oscillator = _audioContext.createOscillator();
  _gainNode = _audioContext.createGain();
  _oscillator.type = 'triangle';
  _gainNode.connect(_audioContext.destination);
  _oscillator.connect(_gainNode);



  var vol = document.getElementById("vol");
  var freq = document.getElementById("freq");

  volumeValue = parseInt(vol.value);
  freqValue = parseInt(freq.value);

  volumeValue = volumeValue / 1000;

  if (volumeValue < 0) {
    volumeValue = 0;
  }

  if (freqValue < 0) {
    freqValue = 0;
  }
  console.log(volumeValue);
  console.log(freqValue);


  _gainNode.gain.value = volumeValue;
  _oscillator.frequency.value = freqValue;


  _oscillator.start(0);
}

