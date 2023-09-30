package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/thecodingmachine/gotenberg-go-client/v7"
)

// Function to handle initial file upload
func handleUpload(w http.ResponseWriter, r *http.Request) {
	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to retrieve file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Save the uploaded file
	savePath := filepath.Join("uploads", handler.Filename)
	saveFile, err := os.Create(savePath)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}
	defer saveFile.Close()

	_, err = io.Copy(saveFile, file)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, "File uploaded successfully")
}

// Function to handle file conversion to specified format (PDF, DOCX, etc.)
func handleConvert(w http.ResponseWriter, r *http.Request) {
	filePath := r.FormValue("file")
	outputFormat := r.FormValue("format")

	if filePath == "" || outputFormat == "" {
		http.Error(w, "Invalid file or format", http.StatusBadRequest)

		c := &gotenberg.Client{Hostname: "http://localhost:3001"}

		doc, _ := gotenberg.NewDocumentFromPath(outputFormat, filePath)

		outputPath := "converted/result." + outputFormat

		req := gotenberg.NewOfficeRequest(doc)
		err := c.Store(req, outputPath)

		if err != nil {
			http.Error(w, "Error converting file", http.StatusInternalServerError)
			return
		}

		fmt.Fprint(w, outputPath)
	}

}

func main() {
	http.HandleFunc("/upload", handleUpload)
	http.HandleFunc("/convert", handleConvert)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
