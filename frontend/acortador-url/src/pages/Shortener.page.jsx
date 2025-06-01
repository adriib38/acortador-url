import React, { useState } from "react";
import { short } from "../services/shortService";
import { useAuthFetch } from "../auth/authFetch";
import { ENDPOINTS } from "../api/endpoints";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Shortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrFileName, setQrUrl] = useState("");
  
  const authFetch = useAuthFetch();

  const { username, accessToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authFetch(ENDPOINTS.shortLink.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ url: longUrl }),
      });
      
      const data = await res.json();
      console.log("Response link short:", data);
      if (res.status === 200) {
        setShortUrl(data.short);
        setQrUrl(data.qrFileName);
        setLongUrl("");
        setLoading(false);

      } else {
        setError("Error al acortar la URL");
        setLoading(false);
      }
    } catch (err) {
      setError("Error al acortar la URL");
    }
  }

  return (
    <div>
      <h1>Acortador de URL</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Ingresa la URL larga"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Acortando..." : "Acortar URL"}
        </button>
      </form>
      {shortUrl && (
        <div>
          <h2>URL Acortada:</h2>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
          {qrFileName && <img src={qrFileName} alt="QR Code" />}
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}







