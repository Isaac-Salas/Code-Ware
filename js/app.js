// Changed to my AWS Judge0 instance
const baseUrl = 'http://3.21.190.20:2358';

// For "about" endpoint
const url = `${baseUrl}/about`;
const options = {
  method: 'GET'
};

fetch(url, options)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });



document.getElementById('myButton').addEventListener('click', submitCodeToJudge0);
// For code submission using mi own API
function submitCodeToJudge0() {
  const code = editor.getValue();
  languageId = document.getElementById('languageId').value;
  const submitUrl = `${baseUrl}/submissions?base64_encoded=false&wait=true`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      language_id: languageId,
      source_code: code
    })
  };

  return fetch(submitUrl, options)
    .then(response => response.json())
    .then(data => {
      let output = '';
      if (data.stdout) {
        output = data.stdout;
      } else if (data.stderr) {
        output = data.stderr;
      } else if (data.compile_output) {
        output = data.compile_output;
      } else {
        output = 'No output';
      }
      document.getElementById('output').textContent = output;
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('output').textContent = 'Error: ' + error;
      throw error;
    });
}


document.getElementById('startTimerBtn').addEventListener('click', startCountdown);


let timerInterval;
let timerSeconds = 10; // Set your countdown seconds here
let lives = 4; // Only set here!

function renderHearts() {
    const heartBar = document.getElementById('heartBar');
    heartBar.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        if (i < lives) {
            heartBar.innerHTML += '<img src="assets/sprites/LittleHearts.gif" alt="life" style="width:4em;height:4em;margin:0 0.2em;image-rendering: pixelated;">';
        } else {
            heartBar.innerHTML += '<img src="assets/sprites/LittleHeartsEmpty.gif" alt="lost" style="width:4em;height:4em;margin:0 0.2em;image-rendering: pixelated;">';
        }
    }
}

function startCountdown() {
    // Hide the Start button
    const startBtn = document.getElementById('startTimerBtn');
    if (startBtn) startBtn.style.display = 'none';

    // Hide Retry button if present
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) retryBtn.style.display = 'none';

    clearInterval(timerInterval);
    let seconds = timerSeconds;
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = seconds.toString().padStart(2, '0') + ':00';

    // Show hearts bar when timer starts
    renderHearts();
    document.getElementById('heartBar').style.display = 'block';

    timerInterval = setInterval(() => {
        seconds--;
        timerDisplay.textContent = seconds.toString().padStart(2, '0') + ':00';
        if (seconds <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "Time's up!";
            if (lives > 0) {
                lives--;
                renderHearts();
                if (lives > 0) {
                    // Restart the timer after a short delay
                    setTimeout(startCountdown, 1000);
                } else {
                    // Show Retry button when lives run out
                    showRetryButton();
                }
            } else {
                // Show Retry button if lives already 0
                showRetryButton();
            }
        }
    }, 1000);
}

function showRetryButton() {
    let retryBtn = document.getElementById('retryBtn');
    if (!retryBtn) {
        retryBtn = document.createElement('button');
        retryBtn.id = 'retryBtn';
        retryBtn.className = 'btn btn-warning mb-3';
        retryBtn.style.fontSize = '2rem';
        retryBtn.textContent = 'Retry';
        retryBtn.onclick = function() {
            lives = 4;
            retryBtn.style.display = 'none';
            // Hide hearts until Start is pressed again
            document.getElementById('heartBar').style.display = 'none';
            const startBtn = document.getElementById('startTimerBtn');
            if (startBtn) startBtn.style.display = '';
            document.getElementById('timerDisplay').textContent = timerSeconds.toString().padStart(2, '0') + ':00';
        };
        // Insert after the heartBar
        const heartBar = document.getElementById('heartBar');
        heartBar.parentNode.insertBefore(retryBtn, heartBar.nextSibling);
    } else {
        retryBtn.style.display = '';
    }
}

