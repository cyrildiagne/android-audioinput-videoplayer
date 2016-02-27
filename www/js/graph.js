var graphCanvas, graphCtx;

function setupCanvas() {
  graphCanvas = document.getElementById("container")
  graphCanvas.addEventListener('click', onCanvasClicked, false);
  graphCtx = graphCanvas.getContext("2d");
}

function onCanvasClicked(ev) {
  log(ev.clientY);
}

function drawFreq(buf) {

  var w = graphCanvas.width;
  var h = graphCanvas.height;

  graphCtx.fillStyle = '#f7f7f7';
  graphCtx.fillRect(0, 0, w, h);

  graphCtx.fillStyle = 'rgba(255,0,0,0.1)';
  graphCtx.fillRect(0, h - Math.floor(threshold * h), w, 1);
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
