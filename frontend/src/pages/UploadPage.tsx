// src/pages/UploadPage.tsx
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";


const UploadPage = () => {
  const socketRef = useRef<Socket | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("Idle");

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("jwt") || "",
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("image_status", (data) => {
      setStatus(data.status);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading...");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus("Upload successful. Waiting for processing...");
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("Upload failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Card>
        <CardContent className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button onClick={handleUpload} disabled={!file}>
            Upload Image
          </Button>
          <p className="text-sm text-gray-500">Status: {status}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
