// Changed to my AWS Judge0 instance
const baseUrl = 'http://3.145.152.10:2358/';

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
function submitCodeToJudge0(sourceCode, languageId) {
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


