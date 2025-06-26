import React, { useState } from "react";
import axios from "axios";

const ImagePredictor = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setPrediction(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3000/api/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(res.data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.response?.data?.detail || "Prediction failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">🌿 Plant Disease Detector</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 mb-4 file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0 file:text-sm file:font-semibold
        file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />

      {preview && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">🖼️ Preview:</p>
          <img src={preview} alt="Preview" className="mt-1 w-full rounded-md border border-gray-200" />
        </div>
      )}

      <button
        onClick={handleUpload}
        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
      >
        Upload & Predict
      </button>

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-100 p-2 rounded-md border border-red-300">
          ❌ {error}
        </p>
      )}

      {prediction && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Prediction Result</h3>
          <p><span className="font-medium">Class:</span> {prediction.class}</p>
          <p><span className="font-medium">Confidence:</span> {(prediction.prob * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default ImagePredictor;
