console.log("JavaScript loaded!");

// Simple client-side simulator for demo purposes only.
const rainEl = document.getElementById('rain-value');
const levelEl = document.getElementById('level-value');
const predEl = document.getElementById('prediction');
const logEl = document.getElementById('alert-log');
const banner = document.getElementById('alert-banner');
const lastSync = document.getElementById('last-sync');
const thresholdEl = document.getElementById('threshold');

const intensity = document.getElementById('intensity');
const start = document.getElementById('start'); // ✅ FIXED
const stop = document.getElementById('stop');

let auto = null;
let riverLevel = 2.0; // meters
const RIVER_THRESHOLD = 3.5; // overflow threshold in meters (example)
thresholdEl.textContent = RIVER_THRESHOLD.toFixed(2) + ' m';

function simulateStep() {
  // rainfall between 0 and intensity
  const rain = parseInt(intensity.value) * Math.random();

  // water level change: small increase with rain, some natural drainage
  riverLevel += (rain / 100) - (0.02 * Math.random());

  // clamp river level between 0 and 10
  if (riverLevel < 0) riverLevel = 0;
  if (riverLevel > 10) riverLevel = 10;

  // update UI
  rainEl.textContent = Math.round(rain);
  levelEl.textContent = riverLevel.toFixed(2);
  lastSync.textContent = new Date().toLocaleString();

  // prediction check (simple threshold-based)
  if (riverLevel >= RIVER_THRESHOLD) {
    setPrediction(true, rain, riverLevel);
  } else if (riverLevel >= RIVER_THRESHOLD - 0.5) {
    setPrediction('Warning', rain, riverLevel);
  } else {
    setPrediction(false, rain, riverLevel);
  }
}

function setPrediction(status, rain, level) {
  if (status === true) {
    predEl.textContent = 'CRITICAL — Risk of overflow';
    predEl.style.color = 'red';
    showAlert('CRITICAL: River level ' + level.toFixed(2) + ' m — immediate action required');
  } else if (status === 'Warning') {
    predEl.textContent = 'WARNING — Monitor closely';
    predEl.style.color = 'orange';
    showAlert('Warning: River level ' + level.toFixed(2) + ' m — be prepared');
  } else {
    predEl.textContent = 'Normal';
    predEl.style.color = 'black';
    hideAlert();
  }
}

function showAlert(message) {
  const li = document.createElement('li');
  li.textContent = new Date().toLocaleTimeString() + ' — ' + message;
  logEl.prepend(li);

  banner.textContent = message;
  banner.style.backgroundColor = message.startsWith('CRITICAL') ? 'red' : 'yellow';
  banner.style.color = message.startsWith('CRITICAL') ? 'white' : 'black';
  banner.style.padding = '10px';
  banner.style.borderRadius = '8px';
  banner.style.marginTop = '10px';
}

function hideAlert() {
  banner.textContent = '';
  banner.style.backgroundColor = '';
}

start.addEventListener('click', () => { // ✅ FIXED
  if (auto) return;
  auto = setInterval(simulateStep, 1500);
  start.textContent = 'Running';
  start.disabled = true;
  stop.disabled = false;
});

stop.addEventListener('click', () => {
  if (auto) clearInterval(auto);
  auto = null;
  start.textContent = 'Start Auto';
  start.disabled = false;
  stop.disabled = true;
});

stop.disabled = true;
simulateStep();
