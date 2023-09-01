import React, { useState } from 'react';
import { Button, Container, Typography, Grid } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  const handleConvertToPdf = () => {
    if (!selectedFile) {
      console.error('No file selected for conversion.');
      return;
    }
  
    // Create a FormData object and append the selected file
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    // Send a request to the backend to perform the conversion to PDF
    fetch('/convert-to-pdf', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.blob())
      .then((pdfBlob) => {
        // Create a URL for the PDF blob
        const pdfUrl = URL.createObjectURL(pdfBlob);
  
        // Open the PDF in a new tab (you can also provide a download link)
        window.open(pdfUrl, '_blank');
      })
      .catch((error) => {
        console.error('Error converting to PDF:', error);
      });
  };
  
  const handleConvertToImage = () => {
    if (!selectedFile) {
      console.error('No file selected for conversion.');
      return;
    }
  
    // Create a FormData object and append the selected file
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    // Send a request to the backend to perform the conversion to image
    fetch('/convert-to-image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.blob())
      .then((imageBlob) => {
        // Create a URL for the image blob
        const imageUrl = URL.createObjectURL(imageBlob);
  
        // Open the image in a new tab (you can also provide a download link)
        window.open(imageUrl, '_blank');
      })
      .catch((error) => {
        console.error('Error converting to image:', error);
      });
  };
  
  const handleConvertToDocs = () => {
    if (!selectedFile) {
      console.error('No file selected for conversion.');
      return;
    }
  
    // Create a FormData object and append the selected file
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    // Send a request to the backend to perform the conversion to DOCX
    fetch('/convert-to-docx', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.blob())
      .then((docxBlob) => {
        // Create a URL for the DOCX blob
        const docxUrl = URL.createObjectURL(docxBlob);
  
        // Open the DOCX in a new tab (you can also provide a download link)
        window.open(docxUrl, '_blank');
      })
      .catch((error) => {
        console.error('Error converting to DOCX:', error);
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
        </Grid>

        {selectedFile && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" component="p" style={{ marginTop: '1rem' }}>
              Selected File: {selectedFile.name}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedFile}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            disabled={!selectedFile}
            onClick={handleConvertToPdf}
          >
            Convert to PDF
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            disabled={!selectedFile}
            onClick={handleConvertToImage}
          >
            Convert to Image
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            disabled={!selectedFile}
            onClick={handleConvertToDocs}
          >
            Convert to DOCX
          </Button>
        </Grid>
      </Grid>
    </Container>
    </div>
  );
};

export default FileUploader;