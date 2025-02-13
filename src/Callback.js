import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const BACKEND_URL = "https://z1-test-backend.onrender.com";  // Your backend URL

const Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pin, setPin] = useState("");

  useEffect(() => {
    const oauthToken = searchParams.get("oauth_token");

    if (!oauthToken) {
      toast.error("X authentication failed. Missing OAuth token.");
      navigate("/");
      return;
    }
  }, [searchParams, navigate]);

  const handleSubmitPin = async () => {
    const oauthToken = searchParams.get("oauth_token");

    if (!pin) {
      toast.error("Please enter the PIN from X.");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/twitter/pin`, {
        oauth_token: oauthToken,
        oauth_verifier: pin,
      });

      toast.success("Successfully authenticated with X!");
      localStorage.setItem("twitter_token", response.data.access_token);
      localStorage.setItem("twitter_token_secret", response.data.access_token_secret);
      navigate("/");  // Redirect to home page
    } catch (error) {
      console.error("Error verifying X authentication:", error);
      toast.error("Failed to authenticate with X.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Authenticate with X</h2>
      <p>Please enter the PIN from X to complete authentication:</p>
      <input
        type="text"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter PIN here"
        style={{ padding: "10px", margin: "10px" }}
      />
      <button onClick={handleSubmitPin} style={{ padding: "10px" }}>Submit</button>
    </div>
  );
};

export default Callback;
