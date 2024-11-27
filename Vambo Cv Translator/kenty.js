document.getElementById('cvFile').addEventListener('change', handleFileUpload);
document.getElementById('cvForm').addEventListener('submit', handleFormSubmit);

function handleFileUpload(event) {
  const file = event.target.files[0];
  const fileReader = new FileReader();

  if (file) {
    const fileName = file.name.toLowerCase();

    // Check file type and extract content accordingly
    if (fileName.endsWith('.docx')) {
      // Extract text from .docx using Mammoth
      fileReader.onload = function(e) {
        const arrayBuffer = e.target.result;
        mammoth.extractRawText({ arrayBuffer: arrayBuffer })
          .then(function(result) {
            document.getElementById('cvText').value = result.value; // Display content in textarea
          })
          .catch(function(err) {
            console.error('Error extracting .docx file:', err);
            alert('Error extracting text from the .docx file.');
          });
      };
      fileReader.readAsArrayBuffer(file);
    }
    else if (fileName.endsWith('.txt')) {
      // Extract text from .txt files
      fileReader.onload = function(e) {
        document.getElementById('cvText').value = e.target.result; // Display content in textarea
      };
      fileReader.readAsText(file);
    }
    else if (fileName.endsWith('.pdf')) {
      // Extract text from .pdf files
      fileReader.onload = function(e) {
        const typedArray = new Uint8Array(e.target.result);
        pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
          let textContent = '';
          const numPages = pdf.numPages;

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            pdf.getPage(pageNum).then(function(page) {
              page.getTextContent().then(function(text) {
                text.items.forEach(function(item) {
                  textContent += item.str + ' ';
                });

                // When all pages are processed, display content in textarea
                if (pageNum === numPages) {
                  document.getElementById('cvText').value = textContent;
                }
              });
            });
          }
        }).catch(function(err) {
          console.error('Error extracting text from PDF:', err);
          alert('Error extracting text from the PDF file.');
        });
      };
      fileReader.readAsArrayBuffer(file);
    }
    else {
      alert('Unsupported file format. Please upload a .docx, .txt, or .pdf file.');
    }
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  const cvText = document.getElementById('cvText').value;
  const cvLang = document.getElementById('cvLang').value;
  const targetLang = document.getElementById('targetLang').value;

  if (cvText.trim()) {
    // Translate the extracted text using Vambo API
    translateText(cvText, cvLang, targetLang);
  } else {
    alert('Please upload a CV and enter text.');
  }
}

function translateText(text, sourceLang, targetLang) {
  const apiUrl = 'https://api.vambo.ai/v1/translate/text';
  const apiKey = 'vai-Noa6y13ipzD194bLWyzaVhRY7spxC84F'; // Replace with your API key

  const requestBody = {
    text: text,
    source_lang: sourceLang,
    target_lang: targetLang
  };

  // Send request to Vambo API
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('translatedCV').textContent = data.output;
  })
  .catch(error => {
    console.error('Translation Error:', error);
  });
}
