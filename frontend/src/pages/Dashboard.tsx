import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface DecodedToken {
  email: string;
  name: string;
  picture?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Idle");

  const socketRef = useRef<Socket | null>(null);

  // Decode JWT and set user info
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("✅ Decoded JWT:", decoded);
        setUser(decoded);
        localStorage.setItem("jwt", token); // Save token for future use
      } catch (error) {
        console.error("❌ Failed to decode JWT:", error);
      }
    } else {
      console.warn("⚠️ No token found in URL");
    }
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("image_status", (data) => {
      console.log("📡 Status update:", data);
      setStatus(data.status);
    });

    socket.on("disconnect", () => {
      console.log("🚫 Socket disconnected");
    });

    socket.on("image_status", (data) => {
      console.log("📡 Status received:", data);
      if (data.status === "Upload complete") {
        setStatus("Upload complete");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Missing JWT token");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/protectedUpload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Upload successful:", res.data);
      setStatus("Upload complete. Waiting for processing...");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setStatus("Upload failed.");
    }
  };

  // Render
  if (!user) {
    return <p>User not found. Please log in.</p>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Welcome, {user.name}!</h1>
      <p><strong>Email:</strong> {user.email}</p>
      {user.picture && (
        <img
          src={user.picture}
          alt="Profile"
          width={100}
          style={{ borderRadius: "50%", marginTop: "1rem" }}
        />
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Upload Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Upload
      </button>

      <p style={{ marginTop: "1rem" }}>
        <strong>Processing Status:</strong> {status}
      </p>
    </div>
  );
}
