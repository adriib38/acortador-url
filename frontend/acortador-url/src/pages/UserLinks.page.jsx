import React, { useEffect, useState } from "react";
import { short } from "../services/shortService";
import { useAuthFetch } from "../auth/authFetch";
import { ENDPOINTS } from "../api/endpoints";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function UserLinks() {
  const [loading, setLoading] = useState(false);
  const [userUrls, setUserUrls] = useState([]);
  const [error, setError] = useState(null);

  const authFetch = useAuthFetch();

  const { username, accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await authFetch(ENDPOINTS.auth.profile, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        if (res.status === 200) {
          setUserUrls(data.urls);
        } else {
          setError("Error al obtener el perfil");
        }
      } catch (err) {
        setError("Error al obtener el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>URL Original</th>
              <th>URL Acortada</th>
              <th>Código QR</th>
              <th>Fecha de Creación</th>
              <th>Visitas</th>
            </tr>
          </thead>
          <tbody>
            {userUrls.map((url) => (
              <tr key={url._id}>
                <td>{url.long}</td>
                <td>{url.short}</td>
                <td><img src={url.qrFileName} alt="QR Code" /></td>
                <td>{new Date(url.createdAt).toLocaleDateString()}</td>
                <td>{url.visits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}







