import React, { useState } from 'react';
import { Button, Container, Typography, Grid } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('format', fileType);

    fetch('/upload-and-convert', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.text())
      .then((filePath) => {
        window.open(filePath, '_blank');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div
      style={{
        background: `url('space_background.jpg')`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        File Uploader
      </Typography>

      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <input
            type="file"
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            id="file-input"
            onChange={handleFileChange}
          />
          <label htmlFor="file-input">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Select File
            </Button>
          </label>
        </Grid> {selectedFile && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" component="p" style={{ marginTop: '1rem' }}>
              Selected File: {selectedFile.name}
            </Typography>
            <select onChange={(e) => setFileType(e.target.value)} value={fileType}>
                <option value="">Select file type</option>
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="docx">DOCX</option>
            </select>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedFile || !fileType}
            onClick={handleUpload}
          >
            Upload and Convert
          </Button>
        </Grid>
        
      </Grid>
    </Container>
    </div>
  );
};

export default FileUploader;