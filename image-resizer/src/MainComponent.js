import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const BACKEND_URL = "https://z1-test-backend.onrender.com"; // 🔹 Your backend URL
const BACKEND_URL = " http://127.0.0.1:8000"; // 🔹 Your deployed backend

const MainComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resizedImages, setResizedImages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔹 Check if user is authenticated when page loads
  useEffect(() => {
    const token = localStorage.getItem("twitter_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // 🔹 Handle file selection
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
      console.log("Selected file:", acceptedFiles[0].name);
      toast.info("File selected: " + acceptedFiles[0].name);
    },
  });

  // 🔹 Authenticate with X (Twitter)
  const handleAuthenticate = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/twitter`);
      console.log("Authentication success:", response.data);
      toast.success("Authentication started. Redirecting...");
      window.location.href = response.data.auth_url; // 🔹 Redirect user to X login
    } catch (error) {
      console.error("Error authenticating with X", error);
      toast.error("X authentication failed.");
    }
  };

  // 🔹 Upload image to backend
  const handleUpload = async () => {
    if (!isAuthenticated) {
      toast.warning("Please authenticate with X first!");
      return;
    }

    if (!selectedFile) {
      toast.warning("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(`${BACKEND_URL}/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResizedImages(response.data.files);
      console.log("Upload success:", response.data);
      toast.success("Images uploaded and resized successfully!");
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Failed to upload image.");
    }
  };

  // 🔹 Post resized image to X
  const handlePostToTwitter = async () => {
    if (!isAuthenticated) {
      toast.warning("Please authenticate with X first!");
      return;
    }

    if (!resizedImages.length) {
      toast.warning("No images to post. Upload images first.");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/post-twitter/`,
        { images: resizedImages },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Posted to X:", response.data);
      toast.success("Images posted to X successfully!");
    } catch (error) {
      console.error("Error posting to X", error);
      toast.error("Failed to post images to X.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Image Resizer & X Publisher</h2>

      {!isAuthenticated ? (
        <button
          onClick={handleAuthenticate}
          style={{ marginBottom: "10px", padding: "10px" }}
        >
          Authenticate with X
        </button>
      ) : (
        <p>✅ You are authenticated!</p>
      )}

      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select one</p>
      </div>

      {selectedFile && <p>Selected file: {selectedFile.name}</p>}

      <button
        onClick={handleUpload}
        style={{ marginTop: "10px", padding: "10px" }}
      >
        Upload & Resize
      </button>

      {resizedImages.length > 0 && (
        <button
          onClick={handlePostToTwitter}
          style={{ marginTop: "10px", padding: "10px" }}
        >
          Post to X
        </button>
      )}

      <div>
        <h3>Resized Images:</h3>
        {resizedImages.map((img, index) => (
          <div key={index}>
            <img
              src={`${BACKEND_URL}${img}`}
              alt="Resized"
              style={{ margin: "10px", maxWidth: "200px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainComponent;

// import React, { useState } from "react";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const BACKEND_URL = "https://z1-test-backend.onrender.com"; // Backend URL

// const MainComponent = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [resizedImage, setResizedImage] = useState(null);
//   const [width, setWidth] = useState(300);
//   const [height, setHeight] = useState(250);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Check if user is authenticated
//   useState(() => {
//     const token = localStorage.getItem("twitter_token");
//     if (token) setIsAuthenticated(true);
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "image/*",
//     onDrop: (acceptedFiles) => {
//       setSelectedFile(acceptedFiles[0]);
//       console.log("Selected file:", acceptedFiles[0].name);
//       toast.info("File selected: " + acceptedFiles[0].name);
//     },
//   });

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       toast.warning("Please select an image first");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await axios.post(
//         `${BACKEND_URL}/upload/?width=${width}&height=${height}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setResizedImage(response.data.file);
//       console.log("Upload success:", response.data);
//       toast.success("Image uploaded and resized successfully!");
//     } catch (error) {
//       console.error("Error uploading image", error);
//       toast.error("Failed to upload image.");
//     }
//   };

//   const handlePostToTwitter = async () => {
//     if (!isAuthenticated) {
//       toast.warning("Please authenticate with X first!");
//       return;
//     }

//     if (!resizedImage) {
//       toast.warning("No images to post. Upload images first.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${BACKEND_URL}/post-twitter/`,
//         { images: [resizedImage] },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       console.log("Posted to X:", response.data);
//       toast.success("Image posted to X successfully!");
//     } catch (error) {
//       console.error("Error posting to X", error);
//       toast.error("Failed to post image to X.");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2>Image Resizer & X Publisher</h2>

//       {!isAuthenticated && (
//         <button
//           onClick={() => (window.location.href = `${BACKEND_URL}/auth/twitter`)}
//           style={{ marginBottom: "10px", padding: "10px" }}
//         >
//           Authenticate with X
//         </button>
//       )}

//       <div
//         {...getRootProps()}
//         style={{
//           border: "2px dashed #ccc",
//           padding: "20px",
//           cursor: "pointer",
//         }}
//       >
//         <input {...getInputProps()} />
//         <p>Drag & drop an image here, or click to select one</p>
//       </div>

//       {selectedFile && <p>Selected file: {selectedFile.name}</p>}

//       <div style={{ marginTop: "10px" }}>
//         <label>Width: </label>
//         <input
//           type="number"
//           value={width}
//           onChange={(e) => setWidth(e.target.value)}
//           style={{ width: "80px", marginRight: "10px" }}
//         />
//         <label>Height: </label>
//         <input
//           type="number"
//           value={height}
//           onChange={(e) => setHeight(e.target.value)}
//           style={{ width: "80px" }}
//         />
//       </div>

//       <button
//         onClick={handleUpload}
//         style={{ marginTop: "10px", padding: "10px" }}
//       >
//         Upload & Resize
//       </button>

//       {resizedImage && (
//         <>
//           <h3>Resized Image:</h3>
//           <img
//             src={`${BACKEND_URL}${resizedImage}`}
//             alt="Resized"
//             style={{ margin: "10px", maxWidth: "300px" }}
//           />
//           <br />
//           <a
//             href={`${BACKEND_URL}${resizedImage}`}
//             download
//             style={{ textDecoration: "none" }}
//           >
//             <button style={{ marginTop: "10px", padding: "10px" }}>
//               Download Resized Image
//             </button>
//           </a>
//           <button
//             onClick={handlePostToTwitter}
//             style={{ marginTop: "10px", padding: "10px" }}
//           >
//             Post to X
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default MainComponent;
