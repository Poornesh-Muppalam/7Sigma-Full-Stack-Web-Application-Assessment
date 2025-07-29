import { useState } from 'react';

export default function Upload({ token }: { token: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5001/protectedUpload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      setStatus('✅ Upload successful!');
    } catch (error: any) {
      setStatus(`❌ Upload failed: ${error.message}`);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Upload Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file} style={{ marginLeft: '1rem' }}>
        Upload
      </button>
      <p>{status}</p>
    </div>
  );
}
