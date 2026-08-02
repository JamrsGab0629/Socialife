const loader = document.getElementById('loader');
const ringFill = document.getElementById('ringFill');
const percentageText = document.getElementById('percentage');

const circumference = 565.48;
const trickleCap = 92;

let currentProgress = 0;
let isLoading = false;
let frameId = null;

function setRing(percent) {
  const offset = circumference - (percent / 100) * circumference;
  ringFill.style.strokeDashoffset = offset;
  percentageText.textContent = Math.round(percent) + '%';
}

function trickle() {
  if (!isLoading) return;

  const remaining = trickleCap - currentProgress;
  currentProgress += remaining * 0.02 + 0.05;
  if (currentProgress > trickleCap) currentProgress = trickleCap;

  setRing(currentProgress);
  frameId = requestAnimationFrame(trickle);
}

function showLoader() {
  isLoading = true;
  currentProgress = 0;
  setRing(0);
  loader.classList.add('active');
  frameId = requestAnimationFrame(trickle);
}

function hideLoader() {
  isLoading = false;
  cancelAnimationFrame(frameId);

  const startValue = currentProgress;
  const startTime = performance.now();
  const finishDuration = 300;

  function finish(time) {
    const t = Math.min((time - startTime) / finishDuration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = startValue + (100 - startValue) * eased;
    setRing(value);

    if (t < 1) {
      requestAnimationFrame(finish);
    } else {
      setTimeout(() => {
        loader.classList.remove('active');
      }, 250);
    }
  }

  requestAnimationFrame(finish);
}

window.socialifeLoader = {
  show: showLoader,
  hide: hideLoader
};