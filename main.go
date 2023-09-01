package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/unidoc/unioffice/document"
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
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

	// Determine the desired output format (e.g., PDF, DOCX) based on user preferences
	outputFormat := r.FormValue("format")

	// Convert the uploaded file to the specified format
	outputPath := convertFile(savePath, outputFormat)
	if outputPath == "" {
		http.Error(w, "Failed to convert file", http.StatusInternalServerError)
		return
	}

	// Send the converted file path as a response
	fmt.Fprint(w, outputPath)
}

func convertFile(filePath, outputFormat string) string {
	doc, err := document.Open(filePath)
	if err != nil {
		return ""
	}
	defer doc.Close()

	var outputPath string

	switch outputFormat {
	case "pdf":
		outputPath = filepath.Join("converted", "output.pdf")
		err = doc.SaveToFile(outputPath)
	case "docx":
		outputPath = filepath.Join("converted", "output.docx")
		err = doc.SaveToFile(outputPath)
		// Additional logic for DOCX conversion can be added here
	}

	if err != nil {
		return ""
	}

	return outputPath
}

func main() {
	http.HandleFunc("/upload", uploadHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
