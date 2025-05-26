const url = 'https://judge0-ce.p.rapidapi.com/about';
const options = {
  method: 'GET',
  headers: {
    'X-Rapidapi-Key': 'c907e904e7msh67b378f5662228dp1cbefbjsn58a924ce3dee',
    'X-Rapidapi-Host': 'judge0-ce.p.rapidapi.com',
    'Host': 'judge0-ce.p.rapidapi.com'
  }
};

fetch(url, options)
  .then(response => response.json())
  .then(data => {
    console.log(data); // Handle the API response here
  })
  .catch(error => {
    console.error('Error:', error);
  });


  document.getElementById('myButton').addEventListener('click', submitCodeToJudge0);

  function submitCodeToJudge0(sourceCode, languageId) {
    sourceCode = document.getElementById('sourceCode').value;
    languageId = document.getElementById('languageId').value;
    const submitUrl = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'c907e904e7msh67b378f5662228dp1cbefbjsn58a924ce3dee',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: sourceCode
      })
    };

    return fetch(submitUrl, options)
      .then(response => response.json())
      .then(data => {

        console.log('Execution result:', data);
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
      return data; // Contains stdout, stderr, etc.
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('output').textContent = 'Error: ' + error;
        throw error;
      });


}

// Example usage:
// submitCodeToJudge0('#include <stdio.h>\nint main() { printf("Hello, World!"); return 0; }', 50);


