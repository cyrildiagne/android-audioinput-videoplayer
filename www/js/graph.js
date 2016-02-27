var graphCanvas, graphCtx;

function setupGraph() {
  graphCanvas = document.getElementById("graph");
  graphCanvas.addEventListener('click', onGraphClicked, false);
  graphCtx = graphCanvas.getContext("2d");
}

function onGraphClicked(ev) {
  var padding = 10;
  threshold = 1 - (ev.clientY - padding) / graphCanvas.clientHeight;
}

function updateGraph() {
  // draw a frequency graph
  drawFreq(fftBuffer);
}

function drawFreq(buf) {

  var w = graphCanvas.width;
  var h = graphCanvas.height;

  // clear the canvas
  graphCtx.fillStyle = '#f7f7f7';
  graphCtx.clearRect(0, 0, w, h);

  // draw the graph
  graphCtx.fillStyle = 'rgba(255,0,0,0.25)';
  graphCtx.fillRect(0, h - Math.floor(threshold * h), w, 3);
  var barWidth = w / analyser.frequencyBinCount;
  for (var i = 0; i < analyser.frequencyBinCount; i++) {
    var value = buf[i];
    var percent = value / 256;
    var height = h * percent;
    var offset = h - height - 1;
    var color = percent > threshold ? 'red' : 'lightgrey';
    graphCtx.fillStyle = color;
    graphCtx.fillRect(i * barWidth, offset, barWidth, height);
  }
}
