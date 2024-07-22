import React, { useState } from 'react';
import './App.css'; 

function App() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      setIsLoading(false);
      if (data.success) {
        setMessage('File uploaded and processed successfully');
      } else {
        setMessage('File upload failed');
      }
    })
    .catch(() => {
      setIsLoading(false);
      setMessage('File upload failed');
    });
  };

  const fetchAnswer = () => {
    fetch('http://127.0.01:5000/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
      .then(response => response.json())
      .then(data => setAnswer(data.answer))
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <h1>Document Query System</h1>
      
      <div className="query-section">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter your query"
          className="input-field"
        />
        <button onClick={fetchAnswer} className="button">Fetch Answer</button>
      </div>
      
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button onClick={handleUpload} className="button">Upload</button>
        <p className="message">{message}</p>
      </div>
      
      <pre className="answer">{answer}</pre>

      {isLoading && (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Uploading file, please wait...</p>
        </div>
      )}
    </div>
  );
}

export default App;
