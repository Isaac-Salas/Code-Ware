// Changed to my AWS Judge0 instance
const baseUrl = 'https://isaac-cwapi.work.gd/';

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
      console.log(data);
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
let timerSeconds = 15; // Set your countdown seconds here
let lives = 4; // Only set here!
let points = 0; // Add this at the top with your other global variables

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

function updatePointsDisplay() {
    const pointsDisplay = document.getElementById('pointsDisplay');
    if (pointsDisplay) {
        pointsDisplay.textContent = `SCORE: ${points}`;
    }
}

function startCountdown() {
    // Hide the Start button
    const startBtn = document.getElementById('startTimerBtn');
    if (startBtn) startBtn.style.display = 'none';

    // Hide Retry button if present
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) retryBtn.style.display = 'none';

    // Hide the upload file button
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.style.display = 'none';

    // Disable the language selection
    const languageSelect = document.getElementById('languageId');
    if (languageSelect) languageSelect.disabled = true;

    // Show the timer when start is pressed (but don't start countdown yet)
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) timerDisplay.style.display = 'block';

    updatePointsDisplay(); // Add this line to show points when the timer shows

    // Change the card title to "Get ready..."
    const cardTitle = document.querySelector('.card-title');
    if (cardTitle) cardTitle.textContent = 'Get ready...';

    // Clean the code editor
    if (typeof editor !== 'undefined' && editor.setValue) {
        editor.setValue('');
    }

    // Attach to the Run Code button
    document.getElementById('myButton').removeEventListener('click', submitCodeToJudge0);
    document.getElementById('myButton').addEventListener('click', submitAndCheckChallenge);

    // Wait a second, then start the challenge and timer
    setTimeout(() => {
        // Load the challenge and update title
        loadRandomChallenge();

        clearInterval(timerInterval);
        let seconds = timerSeconds;
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

                // Show sad face on the title
                const cardTitle = document.querySelector('.card-title');
                if (cardTitle && !cardTitle.textContent.includes(':(')) {
                    let random = Math.floor(Math.random() * 10);
                    cardTitle.textContent = losephrases[random] + ' :(';
                }

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
    }, 2000); // 2 second delay before starting the timer
}

function showRetryButton() {
    // Create or get the flex container for the buttons
    let btnGroup = document.getElementById('retryBackGroup');
    if (!btnGroup) {
        btnGroup = document.createElement('div');
        btnGroup.id = 'retryBackGroup';
        btnGroup.className = 'd-flex align-items-center mb-3';
        // Insert after the timerDisplay
        const timerDisplay = document.getElementById('timerDisplay');
        timerDisplay.parentNode.insertBefore(btnGroup, timerDisplay.nextSibling);
    }
    btnGroup.style.display = 'flex';

    // Hide timer and score when showing retry button
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) timerDisplay.style.display = 'none';
    const pointsDisplay = document.getElementById('pointsDisplay');
    if (pointsDisplay) pointsDisplay.style.display = 'none';

    // Retry button
    let retryBtn = document.getElementById('retryBtn');
    if (!retryBtn) {
        retryBtn = document.createElement('button');
        retryBtn.id = 'retryBtn';
        retryBtn.className = 'btn btn-warning';
        retryBtn.style.fontSize = '2rem';
        retryBtn.textContent = 'Retry!';
        retryBtn.onclick = function() {
            lives = 4;
            retryBtn.style.display = 'none';
            btnGroup.style.display = 'none';
            document.getElementById('heartBar').style.display = 'none';
            const startBtn = document.getElementById('startTimerBtn');
            if (startBtn) startBtn.style.display = '';
            document.getElementById('timerDisplay').textContent = timerSeconds.toString().padStart(2, '0') + ':00';
            document.getElementById('timerDisplay').style.display = 'none';
            // Hide back button as well
            const backBtn = document.getElementById('backBtn');
            if (backBtn) backBtn.style.display = 'none';

            // Change the card title
            const cardTitle = document.querySelector('.card-title');
            if (cardTitle) cardTitle.textContent = 'Okay, one more time, you got this...';

        };
        btnGroup.appendChild(retryBtn);
    } else {
        retryBtn.style.display = '';
        if (!btnGroup.contains(retryBtn)) btnGroup.appendChild(retryBtn);
    }

    // Back button
    let backBtn = document.getElementById('backBtn');
    if (!backBtn) {
        backBtn = document.createElement('button');
        backBtn.id = 'backBtn';
        backBtn.className = 'btn btn-secondary ms-2';
        backBtn.style.fontSize = '2rem';
        backBtn.textContent = 'Sandbox!';
        backBtn.onclick = function() {
            window.location.reload();
        };
        btnGroup.appendChild(backBtn);
    } else {
        backBtn.style.display = '';
        if (!btnGroup.contains(backBtn)) btnGroup.appendChild(backBtn);
    }
}


function loadCodeFileToEditor(fileInputId = 'fileInput') {
    const fileInput = document.getElementById(fileInputId);
    if (!fileInput || !fileInput.files.length) return;

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        editor.setValue(e.target.result);
    };
    reader.readAsText(file);
}

// Attach this to your file input change event
document.getElementById('fileInput').addEventListener('change', function() {
    loadCodeFileToEditor('fileInput');
});

function loadCodeFromServer(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(code => {
            editor.setValue(code);
        })
        .catch(error => {
            alert('Failed to load file: ' + error);
        });
    return url
}


const challenges = [
    {
        title : "SPEAK!!!",
        languageId: "53", // C++
        path: 'assets/code-challenges/Speak.cpp',
        idle : 'assets/animations/Speak/SpeakIdle.gif',
        good : 'assets/animations/Speak/SpeakGood.gif',
        bad : 'assets/animations/Speak/SpeakBad.gif', 
        expectedOutput: "Hello there!"
    },
    {
        title : "MOVE!!!",
        languageId: "71", // C++
        path: 'assets/code-challenges/Speak.cpp',
        idle : 'assets/animations/Speak/SpeakIdle.gif',
        good : 'assets/animations/Speak/SpeakGood.gif',
        bad : 'assets/animations/Speak/SpeakBad.gif', 
        expectedOutput: "Hello there!"
    },
    {
        title : "2!",
        languageId: "53", // C++
        path: 'assets/code-challenges/Speak.cpp',
        idle : 'assets/animations/Speak/SpeakIdle.gif',
        good : 'assets/animations/Speak/SpeakGood.gif',
        bad : 'assets/animations/Speak/SpeakBad.gif', 
        expectedOutput: "Hello there!"
    },
    {
        title : "3!",
        languageId: "53", // C++
        path: 'assets/code-challenges/Speak.cpp',
        idle : 'assets/animations/Speak/SpeakIdle.gif',
        good : 'assets/animations/Speak/SpeakGood.gif',
        bad : 'assets/animations/Speak/SpeakBad.gif', 
        expectedOutput: "Hello there!"
    },
    {
        title : "4!",
        languageId: "53", // C++
        path: 'assets/code-challenges/Speak.cpp',
        idle : 'assets/animations/Speak/SpeakIdle.gif',
        good : 'assets/animations/Speak/SpeakGood.gif',
        bad : 'assets/animations/Speak/SpeakBad.gif', 
        expectedOutput: "Hello there!"
    }
];


function loadRandomChallenge() {
    if (!challenges.length) return;
    const rightImg = document.getElementById('animations');
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomIndex];
    loadCodeFromServer(challenge.path);
    document.getElementById('languageId').value = challenge.languageId;
    window.currentChallenge = challenge;
    rightImg.src = window.currentChallenge.idle

    // Change the card title to the challenge title
    const cardTitle = document.querySelector('.card-title');
    if (cardTitle) cardTitle.textContent = challenge.title;
}

function setStartImage() {
    const rightImg = document.getElementById('animations');
    if (rightImg) rightImg.src = 'assets/animations/StartCat.gif'; // Change to your desired image
}

// Usage: call this ONLY when the start button is pressed, not inside the timer logic
document.getElementById('startTimerBtn').addEventListener('click', function() {
    setStartImage();
    startCountdown();
});



// The whole ass beating heart of this game
async function submitAndCheckChallenge() {

    const rightImg = document.getElementById('animations');
    // Only check if a challenge is loaded and the game is started
    if (!window.currentChallenge) {
        await submitCodeToJudge0(); // fallback to normal submit if not in challenge mode
        return;
    }

    // Show "Processing" while waiting for the response
    document.getElementById('output').textContent = 'Processing...';

    // Submit code and wait for Judge0 response
    const code = editor.getValue();
    const languageId = document.getElementById('languageId').value;
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

    try {
        const response = await fetch(submitUrl, options);
        const data = await response.json();
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

        // Compare output to expected
        const expected = (window.currentChallenge.expectedOutput || '').trim();
        if (output.trim() === expected) {
            console.log('Correct! You fixed the code!');
            points++; // Increment points
            updatePointsDisplay(); // Update the display
            rightImg.src = window.currentChallenge.good
            const cardTitle = document.querySelector('.card-title');
            let random = Math.floor(Math.random() * 10);
            cardTitle.textContent = goodphrases[random]
            clearInterval(timerInterval);
            const timerDisplay = document.getElementById('timerDisplay');
            timerDisplay.textContent = 'A little break 4 U :)'
            setTimeout(() => {
              rightImg.src = window.currentChallenge.idle
              startCountdown();
            }, 1200);

            // Pause the countdown timer
            
        } else {
            console.log('Output does not match expected. Try again!');
            rightImg.src = window.currentChallenge.bad
            const cardTitle = document.querySelector('.card-title');
            const previnst = cardTitle.textContent
            let random = Math.floor(Math.random() * 10);
            cardTitle.textContent = badphrases[random]
            setTimeout(() => {
              cardTitle.textContent = previnst
              rightImg.src = window.currentChallenge.idle
            }, 1200);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').textContent = 'Error: ' + error;
    }
}

const badphrases = [
  'Not quite.', 
  'Close.', 
  'Maybe its not that one...', 
  'Didnt think so...', 
  'Almost?', 
  'Not really', 
  'Nah', 
  ':|',
  '¯|_(ツ)_|¯',
  'Try something else?'
  
]
const goodphrases = [
  'NICE!',
  'You got it!!!',
  'All good!',
  'You nailed that one!',
  'Doing GREAT!', 
  'YEEEAH!',
  'EZ!', 
  'You are too good!!!', 
  'TRYHARD',
  'WOW!!!!!'
]
const losephrases = [
  'Thats rough ',
  'DARN IT',
  'Better luck next time',
  'Oh man...',
  'Well...',
  'Git gud?',
  'This is hard',
  'Try harder?',
  'What happend?',
  '...'
]